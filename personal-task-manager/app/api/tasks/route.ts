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

        if (!name || !description || !dueDate) {
            throw new Error('Missing required fields: name, description, dueDate');
        }

        const isoDueDate = new Date(dueDate).toISOString(); 

        const newTask = await prisma.task.create({
            data: { name, description, dueDate: isoDueDate, priority },
        });

        return NextResponse.json(newTask, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create task' }, { status: 500});
    }    
}

export async function DELETE(req: NextRequest) {
    try {
        const { id } = await req.json();
        if (!id) {
            throw new Error('Missing task ID');
        }

        await prisma.task.delete({
            where: { id: Number(id) },
        });
        return NextResponse.json({}, { status: 204 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { id, name, description, dueDate, priority, completed } = await req.json();

        if (!id) {
            throw new Error('Missing task ID');
        }
        const updateData: any = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (dueDate) updateData.dueDate = new Date(dueDate).toISOString();
        if (typeof priority !== 'undefined') updateData.priority = priority;
        if (typeof completed !== 'undefined') updateData.completed = completed;
       
        if (Object.keys(updateData).length === 0) {
            throw new Error('No valid fields provided for update');
        }
          
        const updatedTask = await prisma.task.update({
            where: { id: Number(id) },
            data: updateData,
        });

        return NextResponse.json(updatedTask);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update task', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
