"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface HistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function HistoryModal({ isOpen, onClose }: HistoryModalProps) {
    const [activeTab, setActiveTab] = useState<"cleanliness" | "duty">("cleanliness");
    const [cleanlinessReports, setCleanlinessReports] = useState<any[]>([]);
    const [dutyReports, setDutyReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen, activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === "cleanliness") {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/reports/cleanliness`);
                const data = await res.json();
                setCleanlinessReports(data);
            } else {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/reports/duty`);
                const data = await res.json();
                setDutyReports(data);
            }
        } catch (error) {
            console.error("Error fetching history:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-2">
                            📊 Rekod Laporan
                        </h2>
                        <p className="text-slate-500 text-sm">Sejarah laporan yang telah dihantar</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-slate-100 rounded-full">
                        <X className="w-6 h-6 text-slate-400" />
                    </Button>
                </div>

                <div className="p-4 bg-slate-50 border-b border-slate-200 flex gap-2">
                    <Button
                        variant={activeTab === "cleanliness" ? "default" : "outline"}
                        onClick={() => setActiveTab("cleanliness")}
                        className={cn(
                            "rounded-full px-6 transition-all",
                            activeTab === "cleanliness" ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                        )}
                    >
                        🏫 Kebersihan Kelas
                    </Button>
                    <Button
                        variant={activeTab === "duty" ? "default" : "outline"}
                        onClick={() => setActiveTab("duty")}
                        className={cn(
                            "rounded-full px-6 transition-all",
                            activeTab === "duty" ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                        )}
                    >
                        📋 Guru Bertugas
                    </Button>
                </div>

                <div className="flex-1 overflow-auto p-6 bg-slate-50/50">
                    {loading ? (
                        <div className="text-center py-20 text-slate-500">Loading data...</div>
                    ) : (
                        <div className="space-y-4">
                            {activeTab === "cleanliness" ? (
                                <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-xs tracking-wider border-b border-slate-200">
                                            <tr>
                                                <th className="p-4">Minggu</th>
                                                <th className="p-4">Tarikh</th>
                                                <th className="p-4">Sesi</th>
                                                <th className="p-4">Kelas</th>
                                                <th className="p-4">Guru</th>
                                                <th className="p-4 text-right">Markah</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {cleanlinessReports.length === 0 ? (
                                                <tr><td colSpan={6} className="p-8 text-center text-slate-400 italic">Tiada data tersedia</td></tr>
                                            ) : (
                                                cleanlinessReports.map((report) => (
                                                    <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                                                        <td className="p-4 font-semibold text-slate-900">{report.week}</td>
                                                        <td className="p-4 text-slate-600">{new Date(report.date).toLocaleDateString()}</td>
                                                        <td className="p-4">
                                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${report.session === 'Pagi' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'}`}>
                                                                {report.session}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 font-medium text-slate-800">{report.class_name}</td>
                                                        <td className="p-4 text-slate-600">{report.teacher_name}</td>
                                                        <td className="p-4 text-right">
                                                            <span className="font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">{report.total_score}/40</span>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {dutyReports.length === 0 ? (
                                        <div className="text-center text-slate-400 italic py-20">Tiada data tersedia</div>
                                    ) : (
                                        dutyReports.map((report) => (
                                            <Card key={report.id} className="hover:shadow-lg transition-all duration-200 border-slate-200 overflow-hidden group">
                                                <div className="h-1 w-full bg-emerald-500/50 group-hover:bg-emerald-500 transition-colors"></div>
                                                <CardContent className="p-6">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="bg-emerald-100 p-2 rounded-lg text-emerald-700">
                                                                <span className="font-bold text-lg">{report.week}</span>
                                                            </div>
                                                            <div>
                                                                <p className="text-slate-900 font-semibold">{report.teacher_name}</p>
                                                                <p className="text-slate-500 text-xs">{new Date(report.date).toLocaleDateString()}</p>
                                                            </div>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${report.session === 'Pagi' ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'}`}>
                                                            {report.session}
                                                        </span>
                                                    </div>

                                                    <div className="grid md:grid-cols-2 gap-6 mt-4">
                                                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                            <span className="font-semibold text-emerald-700 block mb-2 text-xs uppercase tracking-wider">Aktiviti Harian</span>
                                                            <p className="whitespace-pre-wrap text-slate-700 text-sm leading-relaxed">{report.activities}</p>
                                                        </div>
                                                        <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                                                            <span className="font-semibold text-red-700 block mb-2 text-xs uppercase tracking-wider">Hal-hal Lain</span>
                                                            <p className="whitespace-pre-wrap text-slate-700 text-sm leading-relaxed">{report.issues || "Tiada isu dilaporkan."}</p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
