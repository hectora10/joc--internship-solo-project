import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { TasksProvider } from './TasksContext'
import NavBar from './NavBar';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TasksProvider>
          <div className="flex h-screen">
            <aside className="w-1/5 bg-gray-800 text-white p-4 flex flex-col">
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Navigation</h2>
                <ul className="space-y-2">
                  <li>
                    <a href="/" className="block p-2 rounded hover:bg-gray-700">Dashboard</a>
                  </li>
                  <li>
                    <a href="/tasks" className="block p-2 rounded hover:bg-gray-700">Tasks</a>
                  </li>
                  <li>
                    <a href="/profile" className="block p-2 rounded hover:bg-gray-700">Profile</a>
                  </li>
                </ul>
              </div>
              <div className="mt-auto">
                <h2 className="text-xl font-bold mb-4">Settings</h2>
                <ul className="space-y-2">
                  <li>
                    <a href="/settings" className="block p-2 rounded hover:bg-gray-700">Account Settings</a>
                  </li>
                  <li>
                    <a href="/logout" className="block p-2 rounded hover:bg-gray-700">Logout</a>
                  </li>
                </ul>
              </div>
            </aside>

            <main className="flex-1 p-2 bg-gray-100 overflow-auto">
              <NavBar />
              <header className="mb-6">
                <h1 className="text-3xl font-bold">Personal Task Manager</h1>
              </header>
              <section className="mb-6">
                {children} 
              </section>
            </main>
          </div>
        </TasksProvider>
      </body>
    </html>
  );
}


 