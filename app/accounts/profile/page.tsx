"use client";

import { useEffect, useState } from "react";
import { getCookie } from "@/utils/ApiClient";
import "./profile.css";

interface Row {
    label: string;
    value?: string;
    action?: "Edit" | "Add";
}

function Section({ title, action, rows, onAction }: { title: string; action?: string; rows?: Row[]; onAction: (what: string) => void }) {
    return (
        <section className="profile__section">
            <div className="profile__sectionHead">
                <h2>{title}</h2>
                {action && <button className="profile__link" onClick={() => onAction(title)}>{action}</button>}
            </div>
            {rows?.map((r) => (
                <div className="profile__row" key={r.label}>
                    <div>
                        <p className="profile__label">{r.label}</p>
                        <p className={r.value ? "profile__value" : "profile__value profile__value--empty"}>
                            {r.value || "Not provided"}
                        </p>
                    </div>
                    {r.action && <button className="profile__link" onClick={() => onAction(r.label)}>{r.action}</button>}
                </div>
            ))}
        </section>
    );
}

export default function ProfilePage() {
    const [phone, setPhone] = useState("");

    useEffect(() => {
        // login stores "+919129927862"; show just the 10 digits
        setPhone((getCookie("userPhone") || "").replace(/^\+91/, ""));
    }, []);

    const onAction = (what: string) => {
        // TODO: open edit/add modal for `what`
        console.log("profile action:", what);
    };

    return (
        <div className="profile">
            <h1 className="profile__title">Profile</h1>
            <div className="profile__card">
                <h1 className="profile__heading">Profile</h1>

                <Section
                    title="Login information"
                    onAction={onAction}
                    rows={[
                        { label: "Mobile Number", value: phone, action: "Edit" },
                        { label: "Email Address", action: "Add" },
                    ]}
                />
                <Section
                    title="Personal information"
                    action="Add"
                    onAction={onAction}
                    rows={[{ label: "Full Name" }, { label: "Birthdate" }, { label: "Marital Status" }]}
                />
                <Section title="GSTIN details" action="Add" onAction={onAction} />
            </div>
        </div>
    );
}