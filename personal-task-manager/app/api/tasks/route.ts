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
        console.log('Received task data for creation:', { name, description, dueDate, priority });

        if (!name || !description || !dueDate) {
            throw new Error('Missing required fields: name, description, dueDate');
        }

        const isoDueDate = new Date(dueDate).toISOString(); // Format to yyyy-MM-dd

        const newTask = await prisma.task.create({
            data: { name, description, dueDate: isoDueDate, priority },
        });
        console.log('Task successfully created:', newTask); 
        return NextResponse.json(newTask, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error creating task:', error.message);
        } else {
            console.error('Unknown error creating task:', error)
        }
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
        if (error instanceof Error) {
            console.error('Error deleting task:', error.message);
        } else {
            console.error('Unknown error deleting task:', error);
        }
        return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { id, name, description, dueDate, priority, completed } = await req.json();
        console.log('Request data:', { id, name, description, dueDate, priority, completed });

        if (!id) {
            throw new Error('Missing task ID');
        }
        let updateData: any = {};
        if (typeof completed !== 'undefined') {
            updateData.completed = completed;
        } else {
            if (!name || !description || !dueDate) {
                throw new Error('Missing required fields: name, description, dueDate');
            }

            const isoDueDate = new Date(dueDate).toISOString() // Format to yyyy-MM-dd
            updateData = { name, description, dueDate: isoDueDate, priority };
        }

        const updatedTask = await prisma.task.update({
            where: { id: Number(id) },
            data: updateData,
        });

        console.log('Task successfully updated:', updatedTask);
        return NextResponse.json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        return NextResponse.json({ error: 'Failed to update task', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
