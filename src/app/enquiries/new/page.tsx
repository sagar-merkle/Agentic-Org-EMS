"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { NOW, personaById } from "@/lib/base";
import type { EnquirySource } from "@/lib/types";
import { Btn, Card, Collapsible, Field, inputCls, Page, TitleBand } from "@/components/ui/kit";
import { VariantPicker } from "@/components/sales/bits";

const SOURCES: EnquirySource[] = ["Walk-in", "Digital", "Telephone", "Outdoor"];

export default function NewEnquiry() {
  const { addEnquiry, enquiries, persona, toast } = useStore();
  const router = useRouter();
  const me = personaById(persona).person;
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [vehicles, setVehicles] = useState<string[]>([]);
  const [comments, setComments] = useState("");
  const [source, setSource] = useState<EnquirySource>("Walk-in");
  const [err, setErr] = useState("");

  const submit = () => {
    if (phone.replace(/\D/g, "").length !== 10) return setErr("Enter a valid 10-digit mobile number");
    if (!name.trim()) return setErr("Customer name is required");
    if (!vehicles.length) return setErr("Select at least one interested vehicle");
    addEnquiry({
      id: `ENQ-${4100 + enquiries.length}`, name: name.trim(), phone: `+91 ${phone}`, receivedAt: NOW.toISOString(), createdBy: me,
      assignedTo: me, source, vehicles, category: "Not Set", status: "Not Followed Up", followUps: 0, comments, history: [
        { id: `H-${Date.now()}`, ts: NOW.toISOString(), source: "ACCELERATOR", title: "Enquiry created", detail: `Created by ${me}${comments ? `: ${comments}` : ""}` },
      ],
    });
    toast("Enquiry successfully created!");
    router.push("/enquiries");
  };

  return (
    <div>
      <TitleBand title="Create Enquiry" subtitle="EV" />
      <Page className="space-y-4 max-w-3xl">
        {err && <div className="rounded-xl bg-pink-50 border border-pink-200 text-pink-700 text-sm px-4 py-2">{err}</div>}
        <Card className="p-5 space-y-3">
          <h3 className="font-semibold text-sm">Basic Information</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Mobile number *"><div className="flex"><span className="border border-r-0 border-line rounded-l-lg px-3 py-2 text-sm bg-gray-50">+91</span><input className={`${inputCls} !rounded-l-none`} value={phone} maxLength={10} onChange={(x) => setPhone(x.target.value.replace(/\D/g, ""))} /></div></Field>
            <Field label="Customer name *"><input className={inputCls} value={name} onChange={(x) => setName(x.target.value)} /></Field>
          </div>
        </Card>
        <Card className="p-5 space-y-3">
          <h3 className="font-semibold text-sm">Add Interested Vehicles</h3>
          <VariantPicker value={vehicles} onChange={setVehicles} />
          <Field label="Comments"><textarea rows={2} className={inputCls} value={comments} onChange={(x) => setComments(x.target.value)} /></Field>
        </Card>
        <Collapsible title="Other Information">
          <Field label="Enquiry Type"><select className={inputCls} value={source} onChange={(x) => setSource(x.target.value as EnquirySource)}>{SOURCES.map((s) => <option key={s}>{s}</option>)}</select></Field>
        </Collapsible>
        <p className="text-xs text-gray-400">An auto quotation will be sent to the customer on creation.</p>
        <div className="sticky bottom-3 flex justify-center gap-2"><Btn variant="outline" onClick={() => router.back()}>Cancel</Btn><Btn onClick={submit}>Create Enquiry</Btn></div>
      </Page>
    </div>
  );
}
