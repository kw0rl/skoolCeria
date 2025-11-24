"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GraduationCap, ClipboardCheck, Sparkles, History, Trophy, Sun, Moon } from "lucide-react";

import CleanlinessReportForm from "@/components/CleanlinessReportForm";
import TeacherDutyForm from "@/components/TeacherDutyForm";
import HistoryModal from "@/components/HistoryModal";
import AnalyticsModal from "@/components/AnalyticsModal";

export default function Home() {
  const [session, setSession] = useState<"Pagi" | "Petang">("Pagi");
  const [activeTab, setActiveTab] = useState<"cleanliness" | "duty">("cleanliness");
  const [showHistory, setShowHistory] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Professional Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-serif font-bold text-slate-900 tracking-tight">SkoolCeria</h1>
              <p className="text-[10px] md:text-xs text-slate-500 font-medium uppercase tracking-wider">Sistem Pengurusan Sekolah</p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Desktop Session Toggle */}
            <div className="hidden md:flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSession("Pagi")}
                className={cn(
                  "gap-2 text-sm font-medium transition-all",
                  session === "Pagi" ? "bg-white text-amber-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
                )}
              >
                <Sun className="w-4 h-4" /> Sesi Pagi
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSession("Petang")}
                className={cn(
                  "gap-2 text-sm font-medium transition-all",
                  session === "Petang" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
                )}
              >
                <Moon className="w-4 h-4" /> Sesi Petang
              </Button>
            </div>

            <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-slate-200 text-slate-600 bg-white hover:bg-slate-50 hover:text-slate-900 h-9 w-9 px-0 md:w-auto md:px-4"
                onClick={() => setShowHistory(true)}
              >
                <History className="w-4 h-4" />
                <span className="hidden md:inline">Rekod</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-slate-200 text-slate-600 bg-white hover:bg-slate-50 hover:text-slate-900 h-9 w-9 px-0 md:w-auto md:px-4"
                onClick={() => setShowAnalytics(true)}
              >
                <Trophy className="w-4 h-4" />
                <span className="hidden md:inline">Analisis</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Session Toggle */}
        <div className="md:hidden border-t border-slate-100 bg-slate-50/50 px-4 py-2">
          <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSession("Pagi")}
              className={cn(
                "flex-1 gap-2 text-sm font-medium transition-all h-8",
                session === "Pagi" ? "bg-amber-50 text-amber-700 shadow-sm border border-amber-100" : "text-slate-500 hover:text-slate-900"
              )}
            >
              <Sun className="w-3.5 h-3.5" /> Sesi Pagi
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSession("Petang")}
              className={cn(
                "flex-1 gap-2 text-sm font-medium transition-all h-8",
                session === "Petang" ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100" : "text-slate-500 hover:text-slate-900"
              )}
            >
              <Moon className="w-3.5 h-3.5" /> Sesi Petang
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6 max-w-6xl py-10">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">
            Selamat Datang, Cikgu.
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            Sila pilih jenis laporan yang ingin diisi untuk sesi <span className="font-semibold text-slate-900">{session}</span> hari ini.
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div
            onClick={() => setActiveTab("duty")}
            className={cn(
              "group cursor-pointer relative overflow-hidden rounded-2xl border-2 transition-all duration-300 hover:shadow-xl",
              activeTab === "duty"
                ? "border-emerald-500 bg-emerald-50/30 ring-4 ring-emerald-500/10"
                : "border-slate-200 bg-white hover:border-emerald-200"
            )}
          >
            <div className="p-8 flex items-start gap-6">
              <div className={cn(
                "p-4 rounded-xl transition-colors",
                activeTab === "duty" ? "bg-emerald-500 text-white" : "bg-emerald-100 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white"
              )}>
                <ClipboardCheck className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">Laporan Guru Bertugas</h3>
                <p className="text-slate-500 leading-relaxed">
                  Rekod aktiviti harian, perhimpunan, dan isu disiplin murid sepanjang sesi persekolahan.
                </p>
              </div>
            </div>
            {activeTab === "duty" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500"></div>
            )}
          </div>

          <div
            onClick={() => setActiveTab("cleanliness")}
            className={cn(
              "group cursor-pointer relative overflow-hidden rounded-2xl border-2 transition-all duration-300 hover:shadow-xl",
              activeTab === "cleanliness"
                ? "border-indigo-500 bg-indigo-50/30 ring-4 ring-indigo-500/10"
                : "border-slate-200 bg-white hover:border-indigo-200"
            )}
          >
            <div className="p-8 flex items-start gap-6">
              <div className={cn(
                "p-4 rounded-xl transition-colors",
                activeTab === "cleanliness" ? "bg-indigo-500 text-white" : "bg-indigo-100 text-indigo-600 group-hover:bg-indigo-500 group-hover:text-white"
              )}>
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-700 transition-colors">Laporan Kebersihan Kelas</h3>
                <p className="text-slate-500 leading-relaxed">
                  Penilaian mingguan untuk aspek kebersihan, keceriaan, dan papan kenyataan kelas.
                </p>
              </div>
            </div>
            {activeTab === "cleanliness" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500"></div>
            )}
          </div>
        </div>

        {/* Active Form Section */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="border-slate-200 shadow-lg overflow-hidden">
            <div className={cn(
              "h-2 w-full",
              activeTab === "duty" ? "bg-emerald-500" : "bg-indigo-500"
            )}></div>
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-3">
                    {activeTab === "cleanliness" ? (
                      <>
                        <Sparkles className="w-6 h-6 text-indigo-500" />
                        Borang Penilaian Kebersihan
                      </>
                    ) : (
                      <>
                        <ClipboardCheck className="w-6 h-6 text-emerald-500" />
                        Borang Laporan Harian
                      </>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-2 text-slate-500 text-base">
                    Sila lengkapkan maklumat di bawah untuk sesi <span className="font-semibold text-slate-900">{session}</span>.
                  </CardDescription>
                </div>
                <div className="hidden md:block px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 shadow-sm">
                  {new Date().toLocaleDateString('ms-MY', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 bg-white">
              {activeTab === "cleanliness" ? (
                <CleanlinessReportForm session={session} />
              ) : (
                <TeacherDutyForm session={session} />
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Modals */}
      <HistoryModal isOpen={showHistory} onClose={() => setShowHistory(false)} />
      <AnalyticsModal isOpen={showAnalytics} onClose={() => setShowAnalytics(false)} />
    </div>
  );
}
