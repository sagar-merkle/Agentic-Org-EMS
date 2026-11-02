"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { useStore } from "@/lib/store";
import { SLOTS } from "@/lib/seed";
import { COLOUR_HEX, imageFor, variantById, VARIANTS } from "@/lib/variants";
import { NOW, personaById } from "@/lib/base";
import { Btn, Card, Chip, Field, inputCls, inr, Page, TitleBand } from "@/components/ui/kit";

const TOKEN = 5000;

export default function NewBooking() {
  const { enquiries, bookings, addBooking, updateEnquiry, persona, toast } = useStore();
  const router = useRouter();
  const bookable = VARIANTS.filter((v) => v.bookable);
  const [enqId, setEnqId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [variantId, setVariantId] = useState(bookable[0].id);
  const [colour, setColour] = useState(bookable[0].colours[0]);
  const [charger, setCharger] = useState(true);
  const [mode, setMode] = useState<"Cash" | "Finance">("Cash");
  const [err, setErr] = useState("");

  const fill = (id: string) => {
    setEnqId(id);
    const e = enquiries.find((x) => x.id === id);
    if (!e) return;
    setName(e.name); setPhone(e.phone.replace(/\D/g, "").slice(-10));
    const v = e.vehicles.find((x) => variantById(x).bookable);
    if (v) { setVariantId(v); setColour(variantById(v).colours[0]); }
    if (e.intake?.purchaseMode) setMode(e.intake.purchaseMode);
  };
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("enquiry");
    if (q) fill(q);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const v = variantById(variantId);
  const pickVariant = (id: string) => { setVariantId(id); setColour(variantById(id).colours[0]); };
  const xInterested = enquiries.find((x) => x.id === enqId)?.vehicles.includes("tvs-x");

  const submit = () => {
    if (!name.trim() || phone.length !== 10) return setErr("Enter customer name and a 10-digit mobile number");
    if (!otpSent || otp !== "0000") return setErr("Verify the mobile with OTP (demo OTP 0000)");
    addBooking({
      id: `BKG-${2300 + bookings.length}`, enquiryId: enqId || undefined, customer: name.trim(), phone: `+91 ${phone}`, variantId, colour,
      amount: TOKEN, status: "Open Partially Paid", finance: mode, dse: personaById(persona).person, createdAt: NOW.toISOString(), chargerIncluded: charger,
    });
    if (enqId) updateEnquiry(enqId, { status: "Converted" });
    toast("Booking created. Token ₹5,000 (refundable)");
    router.push("/bookings");
  };

  return (
    <div>
      <TitleBand title="Create Booking" right={<Chip className="!bg-white/20 !text-white">EV</Chip>} />
      <Page className="space-y-4 max-w-3xl">
        {err && <div className="rounded-xl bg-pink-50 border border-pink-200 text-pink-700 text-sm px-4 py-2">{err}</div>}
        <Card className="p-4 grid grid-cols-2 gap-3">
          {(["iQube", "Orbiter"] as const).map((f) => (
            <div key={f} className="rounded-xl bg-brand-soft px-4 py-3">
              <div className="text-xs text-gray-500">{f} slots <span className="text-gray-400">(simulated)</span></div>
              <div className="text-xl font-semibold text-brand">{SLOTS[f].left}/{SLOTS[f].total}</div>
            </div>
          ))}
        </Card>

        <Card className="p-5 space-y-3">
          <h3 className="font-semibold text-sm">Customer Details</h3>
          <Field label="From enquiry (optional)">
            <select className={inputCls} value={enqId} onChange={(x) => fill(x.target.value)}>
              <option value="">— New customer —</option>
              {enquiries.filter((e) => e.status !== "Converted").map((e) => <option key={e.id} value={e.id}>{e.name} · {e.id}</option>)}
            </select>
          </Field>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Customer name *"><input className={inputCls} value={name} onChange={(x) => setName(x.target.value)} /></Field>
            <Field label="Mobile number *"><input className={inputCls} value={phone} maxLength={10} onChange={(x) => setPhone(x.target.value.replace(/\D/g, ""))} /></Field>
          </div>
          {xInterested && <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-1.5">TVS X is not bookable yet. The journey stops at test ride; choose an iQube or Orbiter variant below.</p>}
        </Card>

        <Card className="p-5 space-y-4">
          <h3 className="font-semibold text-sm">Vehicle</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Vehicle"><select className={inputCls} value={v.family} onChange={(x) => pickVariant(bookable.find((b) => b.family === x.target.value)!.id)}><option>iQube</option><option>Orbiter</option></select></Field>
            <Field label="Variant"><select className={inputCls} value={variantId} onChange={(x) => pickVariant(x.target.value)}>{bookable.filter((b) => b.family === v.family).map((b) => <option key={b.id} value={b.id}>{b.name} · {inr(b.onRoadInr)}</option>)}</select></Field>
          </div>
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageFor(variantId, colour)} alt="" className="w-32 h-24 object-contain" />
            <div>
              <div className="text-xs text-gray-500 mb-1.5">Colour · {colour}</div>
              <div className="flex gap-2">{v.colours.map((c) => (
                <button key={c} title={c} onClick={() => setColour(c)} className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${colour === c ? "border-brand" : "border-line"}`} style={{ background: COLOUR_HEX[c] }}>{colour === c && <Check size={12} className="text-brand" />}</button>
              ))}</div>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={charger} onChange={(x) => setCharger(x.target.checked)} /> Include 650W charger</label>
          <div className="flex gap-2">{(["Cash", "Finance"] as const).map((m) => <button key={m} onClick={() => setMode(m)} className={`px-4 py-1.5 rounded-full text-sm border ${mode === m ? "bg-brand text-white border-brand" : "border-line"}`}>{m}</button>)}</div>
        </Card>

        <Card className="p-5 space-y-3">
          <h3 className="font-semibold text-sm">Summary</h3>
          <div className="text-sm space-y-1">
            <div className="flex justify-between"><span>{v.name} · {colour}</span><span>{inr(v.onRoadInr)}</span></div>
            <div className="flex justify-between font-semibold"><span>Booking amount <span className="text-xs font-normal text-gray-400">(refundable)</span></span><span>{inr(TOKEN)}</span></div>
          </div>
          <div className="flex gap-2 items-end">
            <Btn variant="outline" onClick={() => { setOtpSent(true); toast("OTP sent (demo: 0000)"); }}>Verify Mobile With OTP</Btn>
            {otpSent && <input className={`${inputCls} !w-28`} placeholder="OTP" maxLength={4} value={otp} onChange={(x) => setOtp(x.target.value)} />}
          </div>
        </Card>
        <p className="text-xs text-gray-400 text-center">Bookings are currently available only for TVS iQube and Orbiter. TVS X stops at test ride.</p>
        <div className="sticky bottom-3 flex justify-center gap-2"><Btn variant="outline" onClick={() => router.back()}>Cancel</Btn><Btn onClick={submit}>Create Booking</Btn></div>
      </Page>
    </div>
  );
}
