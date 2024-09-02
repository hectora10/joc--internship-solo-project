import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const tasks = await prisma.task.findMany();
        return NextResponse.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return NextResponse.json({ error: 'Failed to fetch tasks' }, {status: 500});
    }
}

export async function POST(req: NextRequest) {
    try {
        const { name, description, dueDate, priority } = await req.json();
        console.log('Received task data:', { name, description, dueDate, priority });
        const newTask = await prisma.task.create({
            data: { name, description, dueDate, priority },
        });
        console.log('Task successfully created:', newTask); 
        return NextResponse.json(newTask, { status: 201 });
    } catch (error) {
        console.error('Error creating task:', error);
        return NextResponse.json({ error: 'Failed to create task' }, { status: 500});
    }    
}

export async function DELETE(req: NextRequest) {
    try {
        const { id } = await req.json();
        await prisma.task.delete({
            where: { id: Number(id) },
        });
        return NextResponse.json({}, { status: 204 });
    } catch (error) {
        console.error('Error deleting task:', error);
        return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { id, name, description, dueDate, priority } = await req.json();
        const updatedTask = await prisma.task.update({
            where: { id: Number(id) },
            data: { name, description, dueDate, priority },
        });
        return NextResponse.json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
    }
}
