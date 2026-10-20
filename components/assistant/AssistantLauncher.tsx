"use client";

import { useState } from "react";
import { FiMessageCircle } from "react-icons/fi";
import AssistantPanel from "./AssistantPanel/AssistantPanel";
import "./AssistantPanel/AssistantPanel.css";

export default function AssistantLauncher() {
    const [open, setOpen] = useState(false);
    const [everOpened, setEverOpened] = useState(false);

    const show = () => {
        setEverOpened(true);
        setOpen(true);
    };

    return (
        <>
            {!open && (
                <button className="assistantFab" onClick={show} aria-label="Open travel assistant">
                    <FiMessageCircle size={20} />
                    <span>Ask AI</span>
                </button>
            )}
            {everOpened && <AssistantPanel open={open} onClose={() => setOpen(false)} />}
        </>
    );
}