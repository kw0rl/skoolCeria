"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface Teacher {
    id: number;
    name: string;
}

interface Class {
    id: number;
    name: string;
    session: string;
}

export default function CleanlinessReportForm({ session }: { session: "Pagi" | "Petang" }) {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);

    // Sub-item state
    const [scores, setScores] = useState({
        // Kebersihan (6 items x 5 = 30)
        kebersihan_lantai: 0,
        kebersihan_tingkap: 0,
        kebersihan_sampah: 0,
        kebersihan_kerusi: 0,
        kebersihan_papan_putih: 0,
        kebersihan_penyapu: 0,

        // Keceriaan (2 items x 5 = 10)
        keceriaan_meja_guru: 0,
        keceriaan_kata_hikmah: 0,

        // Papan Kenyataan (2 items x 5 = 10)
        papan_hadapan: 0,
        papan_belakang: 0,

        // Markah Tambahan (4 items x 5 = 20)
        tambahan_langsir: 0,
        tambahan_bacaan: 0,
        tambahan_info: 0,
        tambahan_alas_meja: 0,
    });

    const [formData, setFormData] = useState({
        week: "",
        date: new Date().toISOString().split('T')[0],
        class_id: "",
        teacher_id: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [teachersRes, classesRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/teachers`),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/classes`)
                ]);
                const teachersData = await teachersRes.json();
                const classesData = await classesRes.json();
                setTeachers(teachersData);
                setClasses(classesData.filter((c: Class) => c.session === session));
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, [session]);

    const handleScoreChange = (key: keyof typeof scores, value: number) => {
        setScores(prev => ({ ...prev, [key]: value }));
    };

    // Calculate category totals
    const totalKebersihan =
        scores.kebersihan_lantai + scores.kebersihan_tingkap + scores.kebersihan_sampah +
        scores.kebersihan_kerusi + scores.kebersihan_papan_putih + scores.kebersihan_penyapu;

    const totalKeceriaan = scores.keceriaan_meja_guru + scores.keceriaan_kata_hikmah;

    const totalPapan = scores.papan_hadapan + scores.papan_belakang;

    const totalTambahan =
        scores.tambahan_langsir + scores.tambahan_bacaan + scores.tambahan_info + scores.tambahan_alas_meja;

    const totalScore = totalKebersihan + totalKeceriaan + totalPapan + totalTambahan;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/reports/cleanliness`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    session,
                    score_kebersihan: totalKebersihan,
                    score_keceriaan: totalKeceriaan,
                    score_papan_kenyataan: totalPapan,
                    score_markah_tambahan: totalTambahan,
                    total_score: totalScore
                }),
            });

            if (response.ok) {
                alert("Laporan berjaya disimpan!");
                // Reset scores
                setScores({
                    kebersihan_lantai: 0, kebersihan_tingkap: 0, kebersihan_sampah: 0,
                    kebersihan_kerusi: 0, kebersihan_papan_putih: 0, kebersihan_penyapu: 0,
                    keceriaan_meja_guru: 0, keceriaan_kata_hikmah: 0,
                    papan_hadapan: 0, papan_belakang: 0,
                    tambahan_langsir: 0, tambahan_bacaan: 0, tambahan_info: 0, tambahan_alas_meja: 0,
                });
                setFormData(prev => ({ ...prev, class_id: "", teacher_id: "" }));
            } else {
                alert("Gagal menyimpan laporan.");
            }
        } catch (error) {
            console.error("Error submitting report:", error);
        }
    };

    const StarRating = ({ value, onChange }: { value: number, onChange: (val: number) => void }) => (
        <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    className={`w-5 h-5 cursor-pointer transition-all duration-200 ${i < value ? "fill-amber-400 text-amber-400" : "text-slate-200 hover:text-amber-200"}`}
                    onClick={() => onChange(i + 1)}
                />
            ))}
        </div>
    );

    const RatingRow = ({ label, value, onChange }: { label: string, value: number, onChange: (val: number) => void }) => (
        <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
            <span className="text-sm text-slate-600">{label}</span>
            <StarRating value={value} onChange={onChange} />
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
                        className="border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-900"
                    >
                        <option value="">Pilih Minggu</option>
                        {[...Array(42)].map((_, i) => (
                            <option key={i} value={`M${i + 1}`}>Minggu {i + 1}</option>
                        ))}
                    </Select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Kelas</label>
                    <Select
                        value={formData.class_id}
                        onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
                        required
                        className="border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-900"
                    >
                        <option value="">Pilih Kelas</option>
                        {classes.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
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
                        className="border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-900"
                    />
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="font-serif font-bold text-xl text-slate-800 pb-2">Penilaian Kategori</h3>

                {/* 1. Kebersihan */}
                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-6 space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <h4 className="font-semibold text-slate-800">1. Kebersihan</h4>
                            <span className="text-sm font-medium text-slate-500">Jumlah Kebersihan: {totalKebersihan}/30</span>
                        </div>
                        <div className="space-y-1">
                            <RatingRow label="Lantai bersih" value={scores.kebersihan_lantai} onChange={(v) => handleScoreChange('kebersihan_lantai', v)} />
                            <RatingRow label="Tingkap bersih" value={scores.kebersihan_tingkap} onChange={(v) => handleScoreChange('kebersihan_tingkap', v)} />
                            <RatingRow label="Sampah sarap tidak bersepah" value={scores.kebersihan_sampah} onChange={(v) => handleScoreChange('kebersihan_sampah', v)} />
                            <RatingRow label="Kerusi meja tersusun" value={scores.kebersihan_kerusi} onChange={(v) => handleScoreChange('kebersihan_kerusi', v)} />
                            <RatingRow label="Papan putih bersih" value={scores.kebersihan_papan_putih} onChange={(v) => handleScoreChange('kebersihan_papan_putih', v)} />
                            <RatingRow label="Penyapu, penyodok tersusun" value={scores.kebersihan_penyapu} onChange={(v) => handleScoreChange('kebersihan_penyapu', v)} />
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Keceriaan */}
                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-6 space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <h4 className="font-semibold text-slate-800">2. Keceriaan</h4>
                            <span className="text-sm font-medium text-slate-500">Jumlah Keceriaan: {totalKeceriaan}/10</span>
                        </div>
                        <div className="space-y-1">
                            <RatingRow label="Meja guru beralas dan ceria" value={scores.keceriaan_meja_guru} onChange={(v) => handleScoreChange('keceriaan_meja_guru', v)} />
                            <RatingRow label="Ada kata-kata hikmah" value={scores.keceriaan_kata_hikmah} onChange={(v) => handleScoreChange('keceriaan_kata_hikmah', v)} />
                        </div>
                    </CardContent>
                </Card>

                {/* 3. Papan Kenyataan */}
                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-6 space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <h4 className="font-semibold text-slate-800">3. Papan Kenyataan</h4>
                            <span className="text-sm font-medium text-slate-500">Jumlah Papan Kenyataan: {totalPapan}/10</span>
                        </div>
                        <div className="space-y-1">
                            <RatingRow label="Hadapan: Jadual kelas, bertugas, visi, misi, Pelan Kebakaran" value={scores.papan_hadapan} onChange={(v) => handleScoreChange('papan_hadapan', v)} />
                            <RatingRow label="Belakang: Info pendidikan mengikut mata pelajaran" value={scores.papan_belakang} onChange={(v) => handleScoreChange('papan_belakang', v)} />
                        </div>
                    </CardContent>
                </Card>

                {/* 4. Markah Tambahan */}
                <Card className="border-slate-200 shadow-sm">
                    <CardContent className="p-6 space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <h4 className="font-semibold text-slate-800">4. Markah Tambahan</h4>
                            <span className="text-sm font-medium text-slate-500">Jumlah Markah Tambahan: {totalTambahan}/20</span>
                        </div>
                        <div className="space-y-1">
                            <RatingRow label="Langsir bersih dan kemas" value={scores.tambahan_langsir} onChange={(v) => handleScoreChange('tambahan_langsir', v)} />
                            <RatingRow label="Sudut Bacaan" value={scores.tambahan_bacaan} onChange={(v) => handleScoreChange('tambahan_bacaan', v)} />
                            <RatingRow label="Sudut Info Semasa" value={scores.tambahan_info} onChange={(v) => handleScoreChange('tambahan_info', v)} />
                            <RatingRow label="Alas Meja Murid" value={scores.tambahan_alas_meja} onChange={(v) => handleScoreChange('tambahan_alas_meja', v)} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl text-center shadow-sm">
                <p className="text-indigo-600 text-sm uppercase tracking-widest mb-1 font-semibold">Jumlah Markah Keseluruhan</p>
                <p className="font-serif font-bold text-4xl text-indigo-900">
                    {totalScore}<span className="text-xl text-indigo-400">/70</span>
                </p>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Guru Bertugas</label>
                <Select
                    value={formData.teacher_id}
                    onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
                    required
                    className="border-slate-200 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-900"
                >
                    <option value="">Pilih Guru</option>
                    {teachers.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                </Select>
            </div>

            <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-lg shadow-md hover:shadow-lg transition-all">
                    💾 Simpan Laporan
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    className="bg-white hover:bg-slate-50 text-slate-700 border-slate-200 h-12 px-8"
                    onClick={() => {
                        setScores({
                            kebersihan_lantai: 0, kebersihan_tingkap: 0, kebersihan_sampah: 0,
                            kebersihan_kerusi: 0, kebersihan_papan_putih: 0, kebersihan_penyapu: 0,
                            keceriaan_meja_guru: 0, keceriaan_kata_hikmah: 0,
                            papan_hadapan: 0, papan_belakang: 0,
                            tambahan_langsir: 0, tambahan_bacaan: 0, tambahan_info: 0, tambahan_alas_meja: 0,
                        });
                        setFormData(prev => ({ ...prev, class_id: "", teacher_id: "" }));
                    }}
                >
                    Reset
                </Button>
            </div>
        </form>
    );
}
