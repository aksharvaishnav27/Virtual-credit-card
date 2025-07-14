import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { z } from "zod";

const prisma = new PrismaClient();

// Validation schema for card creation
const cardSchema = z.object({
  spendingLimit: z
    .number()
    .positive({ message: "Spending limit must be positive" }),
  expiryDate: z.string().datetime({ message: "Invalid expiry date format" }),
  merchantLock: z.string().optional(),
  name: z.string().optional(),
});

// Helper function to generate random card number
function generateCardNumber() {
  const prefix = "4111"; // Visa-like prefix
  let number = prefix;

  // Generate 12 more random digits
  for (let i = 0; i < 12; i++) {
    number += Math.floor(Math.random() * 10);
  }

  return number;
}

// Helper function to generate CVV
function generateCVV() {
  return Math.floor(100 + Math.random() * 900).toString();
}

// GET all cards for the authenticated user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cards = await prisma.card.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Mask sensitive data
    const maskedCards = cards.map((card) => ({
      ...card,
      cardNumber: `**** **** **** ${card.lastFourDigits}`,
      cvv: "***",
    }));

    return NextResponse.json(maskedCards);
  } catch (error) {
    console.error("Error fetching cards:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST to create a new virtual card
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate input
    const result = cardSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.format() },
        { status: 400 }
      );
    }

    const { spendingLimit, expiryDate, merchantLock, name } = body;

    // Generate card details
    const cardNumber = generateCardNumber();
    const lastFourDigits = cardNumber.slice(-4);
    const cvv = generateCVV();

    // Create card in database
    const card = await prisma.card.create({
      data: {
        cardNumber,
        lastFourDigits,
        cvv,
        expiryDate: new Date(expiryDate),
        spendingLimit,
        merchantLock,
        name,
        userId: session.user.id,
      },
    });

    // Return masked card data
    const maskedCard = {
      ...card,
      cardNumber: `**** **** **** ${lastFourDigits}`,
      cvv: "***",
    };

    return NextResponse.json(maskedCard, { status: 201 });
  } catch (error) {
    console.error("Error creating card:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
