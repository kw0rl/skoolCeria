"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface Teacher {
    id: number;
    name: string;
}

export default function TeacherDutyForm({ session }: { session: "Pagi" | "Petang" }) {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        week: "",
        date: new Date().toISOString().split('T')[0],
        teacher_id: "",
        activities: "",
        issues: "", // Now "Hal-hal Lain"
        cleanliness_toilet_teacher_m: "",
        cleanliness_toilet_teacher_f: "",
        cleanliness_toilet_student_m: "",
        cleanliness_toilet_student_f: "",
        cleanliness_surau: "",
        cleanliness_school_area: "",
        cleanliness_canteen: "",
        discipline_status: "",
        prepared_by: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const teachersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/teachers`);
                const teachersData = await teachersRes.json();
                setTeachers(teachersData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/reports/duty`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    session
                }),
            });

            if (response.ok) {
                alert("Laporan Guru Bertugas berjaya disimpan!");
                setFormData({
                    week: "",
                    date: new Date().toISOString().split('T')[0],
                    teacher_id: "",
                    activities: "",
                    issues: "",
                    cleanliness_toilet_teacher_m: "",
                    cleanliness_toilet_teacher_f: "",
                    cleanliness_toilet_student_m: "",
                    cleanliness_toilet_student_f: "",
                    cleanliness_surau: "",
                    cleanliness_school_area: "",
                    cleanliness_canteen: "",
                    discipline_status: "",
                    prepared_by: "",
                });
            } else {
                alert("Gagal menyimpan laporan.");
            }
        } catch (error) {
            console.error("Error submitting report:", error);
        }
    };

    const cleanlinessOptions = ["Bersih", "Sederhana", "Kotor"];

    const CleanlinessDropdown = ({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) => (
        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">{label}</label>
            <Select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="border-slate-200 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-slate-900"
            >
                <option value="">Pilih Status</option>
                {cleanlinessOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </Select>
        </div>
    );

    if (loading) return <div className="text-center py-10 text-slate-500">Loading data...</div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Minggu Bertugas</label>
                    <Select
                        value={formData.week}
                        onChange={(e) => setFormData({ ...formData, week: e.target.value })}
                        required
                        className="border-slate-200 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-slate-900"
                    >
                        <option value="">Pilih Minggu</option>
                        {[...Array(42)].map((_, i) => (
                            <option key={i} value={`M${i + 1}`}>Minggu {i + 1}</option>
                        ))}
                    </Select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Tarikh</label>
                    <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                        className="border-slate-200 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-slate-900"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Guru Bertugas</label>
                    <Select
                        value={formData.teacher_id}
                        onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
                        required
                        className="border-slate-200 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-slate-900"
                    >
                        <option value="">Pilih Guru</option>
                        {teachers.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </Select>
                </div>
            </div>

            <div className="space-y-6 border border-slate-200 rounded-xl p-6 bg-slate-50/50">
                <h3 className="font-serif font-bold text-xl text-slate-800 border-b border-slate-200 pb-2">Laporan Aktiviti & Isu</h3>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Aktiviti Harian / Peristiwa</label>
                    <textarea
                        className="flex min-h-[120px] w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm ring-offset-background placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm text-slate-900"
                        placeholder="Catatkan aktiviti harian, perhimpunan, atau acara sekolah..."
                        value={formData.activities}
                        onChange={(e) => setFormData({ ...formData, activities: e.target.value })}
                        required
                    />
                </div>

                {/* New Cleanliness Section */}
                <div className="space-y-4 pt-4 border-t border-slate-200">
                    <h4 className="font-semibold text-slate-800">Laporan Kebersihan</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CleanlinessDropdown
                            label="Tandas Guru (L)"
                            value={formData.cleanliness_toilet_teacher_m}
                            onChange={(v) => setFormData({ ...formData, cleanliness_toilet_teacher_m: v })}
                        />
                        <CleanlinessDropdown
                            label="Tandas Guru (P)"
                            value={formData.cleanliness_toilet_teacher_f}
                            onChange={(v) => setFormData({ ...formData, cleanliness_toilet_teacher_f: v })}
                        />
                        <CleanlinessDropdown
                            label="Tandas Murid (L)"
                            value={formData.cleanliness_toilet_student_m}
                            onChange={(v) => setFormData({ ...formData, cleanliness_toilet_student_m: v })}
                        />
                        <CleanlinessDropdown
                            label="Tandas Murid (P)"
                            value={formData.cleanliness_toilet_student_f}
                            onChange={(v) => setFormData({ ...formData, cleanliness_toilet_student_f: v })}
                        />
                        <CleanlinessDropdown
                            label="Surau"
                            value={formData.cleanliness_surau}
                            onChange={(v) => setFormData({ ...formData, cleanliness_surau: v })}
                        />
                        <CleanlinessDropdown
                            label="Kawasan Sekolah"
                            value={formData.cleanliness_school_area}
                            onChange={(v) => setFormData({ ...formData, cleanliness_school_area: v })}
                        />
                        <CleanlinessDropdown
                            label="Kantin"
                            value={formData.cleanliness_canteen}
                            onChange={(v) => setFormData({ ...formData, cleanliness_canteen: v })}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Laporan Disiplin Murid</label>
                    <Select
                        value={formData.discipline_status}
                        onChange={(e) => setFormData({ ...formData, discipline_status: e.target.value })}
                        className="border-slate-200 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-slate-900"
                    >
                        <option value="">Pilih Status</option>
                        <option value="Terkawal">Terkawal</option>
                        <option value="Sederhana">Sederhana</option>
                        <option value="Tidak Terkawal">Tidak Terkawal</option>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Hal-hal Lain</label>
                    <textarea
                        className="flex min-h-[120px] w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm ring-offset-background placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm text-slate-900"
                        placeholder="Tulis hal hal lain (maksimum 2000 patah perkataan)"
                        value={formData.issues}
                        onChange={(e) => setFormData({ ...formData, issues: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Disediakan Oleh</label>
                    <Select
                        value={formData.prepared_by}
                        onChange={(e) => setFormData({ ...formData, prepared_by: e.target.value })}
                        required
                        className="border-slate-200 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-slate-900"
                    >
                        <option value="">Pilih Guru</option>
                        {teachers.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </Select>
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-lg shadow-md hover:shadow-lg transition-all">
                    💾 Simpan Laporan Harian
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    className="bg-white hover:bg-slate-50 text-slate-700 border-slate-200 h-12 px-8"
                    onClick={() => setFormData({
                        week: "",
                        date: new Date().toISOString().split('T')[0],
                        teacher_id: "",
                        activities: "",
                        issues: "",
                        cleanliness_toilet_teacher_m: "",
                        cleanliness_toilet_teacher_f: "",
                        cleanliness_toilet_student_m: "",
                        cleanliness_toilet_student_f: "",
                        cleanliness_surau: "",
                        cleanliness_school_area: "",
                        cleanliness_canteen: "",
                        discipline_status: "",
                        prepared_by: "",
                    })}
                >
                    Reset
                </Button>
            </div>
        </form>
    );
}
