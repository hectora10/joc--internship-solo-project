import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient

export async function PUT(request: Request) {
    try {
      const { id, completed } = await request.json();
      
      if (!id) {
        return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
      }
  
      const task = await prisma.task.update({
        where: { id: Number(id) },
        data: { completed: completed !== undefined ? completed : true },
      });
  
      return NextResponse.json(task);
    } catch (error) {
      console.error('Error updating task:', error);
      return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
    }
  }