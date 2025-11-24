"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalyticsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AnalyticsModal({ isOpen, onClose }: AnalyticsModalProps) {
    const [session, setSession] = useState<"Pagi" | "Petang">("Pagi");
    const [topClasses, setTopClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen, session]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/analytics?session=${session}`);
            const data = await res.json();
            setTopClasses(data);
        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col border border-slate-200">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-2">
                            🏆 Analisis Keputusan
                        </h2>
                        <p className="text-slate-500 text-sm">Kedudukan kelas terbaik mengikut markah kebersihan</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-slate-100 rounded-full">
                        <X className="w-6 h-6 text-slate-400" />
                    </Button>
                </div>

                <div className="p-6 flex justify-center gap-4 bg-slate-50/50 border-b border-slate-100">
                    <Button
                        variant={session === "Pagi" ? "default" : "outline"}
                        onClick={() => setSession("Pagi")}
                        className={cn(
                            "rounded-full px-8 transition-all",
                            session === "Pagi" ? "bg-amber-500 hover:bg-amber-600 text-white shadow-md" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                        )}
                    >
                        ☀️ Sesi Pagi
                    </Button>
                    <Button
                        variant={session === "Petang" ? "default" : "outline"}
                        onClick={() => setSession("Petang")}
                        className={cn(
                            "rounded-full px-8 transition-all",
                            session === "Petang" ? "bg-indigo-500 hover:bg-indigo-600 text-white shadow-md" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                        )}
                    >
                        🌙 Sesi Petang
                    </Button>
                </div>

                <div className="p-8 bg-white min-h-[300px]">
                    <h3 className="text-center font-bold text-sm uppercase tracking-widest text-slate-400 mb-8">
                        Top 5 Kelas Terbaik
                    </h3>

                    {loading ? (
                        <div className="text-center py-10 text-slate-500">Loading analysis...</div>
                    ) : (
                        <div className="space-y-4">
                            {topClasses.length === 0 ? (
                                <div className="text-center py-10 flex flex-col items-center gap-4">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                                        <Trophy className="w-10 h-10 text-slate-300" />
                                    </div>
                                    <p className="text-slate-500">Tiada data tersedia untuk sesi ini.</p>
                                </div>
                            ) : (
                                topClasses.map((cls, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all hover:border-indigo-100 group"
                                    >
                                        <div className={`
                                            w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white mr-5 shadow-md
                                            ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                                                index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-500' :
                                                    index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-800' : 'bg-slate-100 text-slate-500'}
                                        `}>
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-lg text-slate-800 group-hover:text-indigo-700 transition-colors">{cls.name}</h4>
                                            <div className="h-1.5 w-full bg-slate-100 rounded-full mt-2 overflow-hidden">
                                                <div
                                                    className="h-full bg-indigo-500 rounded-full"
                                                    style={{ width: `${Math.min((cls.total_score / 40) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="text-right pl-4">
                                            <span className="block text-3xl font-bold text-indigo-600">{cls.total_score}</span>
                                            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Markah</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
