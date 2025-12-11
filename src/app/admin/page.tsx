import prisma from "@/lib/prisma";
import { Users, BookOpen, ShieldBan, UserCheck } from "lucide-react";

export default async function AdminDashboard() {
  const userCount = await prisma.user.count();
  const bannedCount = await prisma.bannedUser.count();
  const lessonCount = await prisma.lesson.count();
  const adminCount = await prisma.user.count({
    where: { role: "ADMIN" },
  });

  const StatCard = ({ label, value, icon: Icon, color }: any) => (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex items-center justify-between">
      <div>
        <p className="text-zinc-400 text-sm font-medium mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-white`}>
        <Icon className={`w-6 h-6 ${color.replace("bg-", "text-")}`} />
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-zinc-400">Overview of system statistics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Users"
          value={userCount}
          icon={Users}
          color="bg-emerald-500"
        />
        <StatCard
          label="Admins"
          value={adminCount}
          icon={UserCheck}
          color="bg-purple-500"
        />
        <StatCard
          label="Total Lessons"
          value={lessonCount}
          icon={BookOpen}
          color="bg-blue-500"
        />
        <StatCard
          label="Banned Users"
          value={bannedCount}
          icon={ShieldBan}
          color="bg-red-500"
        />
      </div>

      <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          {/* Placeholder for future buttons */}
          <p className="text-zinc-500 text-sm">
            Use the sidebar to manage Users and Lessons.
          </p>
        </div>
      </div>
    </div>
  );
}
