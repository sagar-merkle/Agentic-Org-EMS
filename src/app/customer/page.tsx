"use client";
import { useState } from "react";
import { MessageCircle, MessagesSquare, Phone } from "lucide-react";
import { TitleBand, Page } from "@/components/ui/kit";
import { ChatTab, VoiceTab, WhatsAppTab } from "@/components/phone/PhoneTabs";

const TABS = [
  { id: "Chat", icon: MessagesSquare },
  { id: "WhatsApp", icon: MessageCircle },
  { id: "Voice", icon: Phone },
] as const;

export default function CustomerPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("Chat");
  return (
    <>
      <TitleBand title="Customer view" subtitle="What the customer sees: web chat, WhatsApp and voice, handled by the AI agents" />
      <Page className="flex justify-center">
        <div className="rounded-[44px] bg-slate-900 p-3 shadow-2xl" style={{ width: 390, height: 800 }}>
          <div className="relative rounded-[32px] bg-white overflow-hidden flex flex-col h-full">
            <div className="h-6 bg-black/0 flex justify-center items-center shrink-0 bg-white"><span className="w-20 h-1.5 rounded-full bg-slate-300" /></div>
            <div className="flex-1 min-h-0">
              {tab === "Chat" && <ChatTab />}
              {tab === "WhatsApp" && <WhatsAppTab />}
              {tab === "Voice" && <VoiceTab />}
            </div>
            <div className="flex border-t border-gray-200 bg-white shrink-0">
              {TABS.map(({ id, icon: Icon }) => (
                <button key={id} onClick={() => setTab(id)} className={`flex-1 py-2.5 text-xs flex flex-col items-center gap-0.5 ${tab === id ? "text-brand font-semibold" : "text-gray-400"}`}>
                  <Icon size={18} />{id}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Page>
    </>
  );
}
