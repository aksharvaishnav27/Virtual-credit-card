import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { z } from "zod";
// import Stripe from 'stripe'; // Uncomment for real transactions
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const prisma = new PrismaClient();

// Validation schema for transaction
const transactionSchema = z.object({
  cardId: z.string(),
  amount: z.number().positive({ message: "Amount must be positive" }),
  merchantName: z.string().min(1, { message: "Merchant name is required" }),
});

// GET all transactions for the authenticated user
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const cardId = searchParams.get("cardId");

    // Build the query
    const query = {
      where: {
        card: {
          userId: session.user.id,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        card: {
          select: {
            lastFourDigits: true,
          },
        },
      },
    };

    // Add cardId filter if provided
    if (cardId) {
      query.where.cardId = cardId;
    }

    const transactions = await prisma.transaction.findMany(query);

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST to create a new transaction (simulate card usage)
export async function POST(request) {
  try {
    const body = await request.json();

    // Validate input
    const result = transactionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 }
      );
    }

    const { cardId, amount, merchantName } = body;

    // Find the card
    const card = await prisma.card.findUnique({
      where: {
        id: cardId,
      },
    });

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    // Check if card is active
    if (!card.isActive) {
      return NextResponse.json(
        { error: "Card is inactive", status: "failed" },
        { status: 400 }
      );
    }

    // Check if card is expired
    if (new Date() > new Date(card.expiryDate)) {
      return NextResponse.json(
        { error: "Card is expired", status: "failed" },
        { status: 400 }
      );
    }

    // Check if transaction exceeds spending limit
    if (card.currentSpent + amount > card.spendingLimit) {
      // Create a failed transaction record
      const transaction = await prisma.transaction.create({
        data: {
          amount,
          merchantName,
          status: "failed",
          cardId,
        },
      });

      return NextResponse.json(
        {
          error: "Transaction exceeds spending limit",
          status: "failed",
          transaction,
        },
        { status: 400 }
      );
    }

    // Check merchant lock if applicable
    if (
      card.merchantLock &&
      !merchantName.toLowerCase().includes(card.merchantLock.toLowerCase())
    ) {
      // Create a failed transaction record
      const transaction = await prisma.transaction.create({
        data: {
          amount,
          merchantName,
          status: "failed",
          cardId,
        },
      });

      return NextResponse.json(
        {
          error: "Merchant not allowed for this card",
          status: "failed",
          transaction,
        },
        { status: 400 }
      );
    }

    // ===== REAL TRANSACTION PROCESSING (Stripe Integration) =====
    // Uncomment the following code to enable real transactions with Stripe:

    /*
    try {
      // Create payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        payment_method_types: ['card'],
        metadata: {
          cardId: cardId,
          merchantName: merchantName,
          virtualCardNumber: card.cardNumber,
        },
      });

      // Confirm the payment
      const paymentIntentConfirm = await stripe.paymentIntents.confirm(
        paymentIntent.id,
        {
          payment_method: {
            card: {
              number: card.cardNumber,
              exp_month: new Date(card.expiryDate).getMonth() + 1,
              exp_year: new Date(card.expiryDate).getFullYear(),
              cvc: card.cvv,
            },
          },
        }
      );

      if (paymentIntentConfirm.status === 'succeeded') {
        // Process the transaction
        const updatedCard = await prisma.card.update({
          where: { id: cardId },
          data: { currentSpent: card.currentSpent + amount },
        });

        const transaction = await prisma.transaction.create({
          data: {
            amount,
            merchantName,
            status: "success",
            cardId,
          },
        });

        return NextResponse.json({
          status: "success",
          transaction,
          remainingBalance: updatedCard.spendingLimit - updatedCard.currentSpent,
        });
      } else {
        throw new Error('Payment failed');
      }
    } catch (stripeError) {
      console.error('Stripe error:', stripeError);
      
      // Create failed transaction record
      const transaction = await prisma.transaction.create({
        data: {
          amount,
          merchantName,
          status: "failed",
          cardId,
        },
      });

      return NextResponse.json(
        { error: "Payment processing failed", status: "failed", transaction },
        { status: 400 }
      );
    }
    */

    // ===== SIMULATION MODE (Current Implementation) =====
    // Process the transaction (simulation)
    const updatedCard = await prisma.card.update({
      where: {
        id: cardId,
      },
      data: {
        currentSpent: card.currentSpent + amount,
      },
    });

    // Create a successful transaction record
    const transaction = await prisma.transaction.create({
      data: {
        amount,
        merchantName,
        status: "success",
        cardId,
      },
    });

    return NextResponse.json({
      status: "success",
      transaction,
      remainingBalance: updatedCard.spendingLimit - updatedCard.currentSpent,
    });
  } catch (error) {
    console.error("Error processing transaction:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
