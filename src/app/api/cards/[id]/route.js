import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

// GET a specific card by ID
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cardId = params.id;

    const card = await prisma.card.findUnique({
      where: {
        id: cardId,
      },
      include: {
        transactions: true,
      },
    });

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    // Check if the card belongs to the authenticated user
    if (card.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Mask sensitive data
    const maskedCard = {
      ...card,
      cardNumber: `**** **** **** ${card.lastFourDigits}`,
      cvv: "***",
    };

    return NextResponse.json({
      card: maskedCard,
      transactions: card.transactions,
    });
  } catch (error) {
    console.error("Error fetching card:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH to update a card (e.g., deactivate it)
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cardId = params.id;
    const body = await request.json();

    // Check if the card exists and belongs to the user
    const existingCard = await prisma.card.findUnique({
      where: {
        id: cardId,
      },
    });

    if (!existingCard) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    if (existingCard.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update the card
    const updatedCard = await prisma.card.update({
      where: {
        id: cardId,
      },
      data: {
        isActive:
          body.isActive !== undefined ? body.isActive : existingCard.isActive,
        spendingLimit: body.spendingLimit || existingCard.spendingLimit,
        merchantLock:
          body.merchantLock !== undefined
            ? body.merchantLock
            : existingCard.merchantLock,
      },
    });

    // Mask sensitive data
    const maskedCard = {
      ...updatedCard,
      cardNumber: `**** **** **** ${updatedCard.lastFourDigits}`,
      cvv: "***",
    };

    return NextResponse.json(maskedCard);
  } catch (error) {
    console.error("Error updating card:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE a card
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cardId = params.id;

    // Check if the card exists and belongs to the user
    const existingCard = await prisma.card.findUnique({
      where: {
        id: cardId,
      },
    });

    if (!existingCard) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    if (existingCard.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete the card
    await prisma.card.delete({
      where: {
        id: cardId,
      },
    });

    return NextResponse.json({ message: "Card deleted successfully" });
  } catch (error) {
    console.error("Error deleting card:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
