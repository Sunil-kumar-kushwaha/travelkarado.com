export interface AccountMenuItem {
    label: string;
    href: string;
}

export const ACCOUNT_MENU_ITEMS: AccountMenuItem[] = [
    { label: "My Profile", href: "/accounts/profile" },
    { label: "My Trips", href: "/accounts/trips" },
    { label: "Saved Cards", href: "/accounts/saved-cards" },
    { label: "Saved Travellers", href: "/accounts/saved-travellers" },
    { label: "Hi-Five", href: "/accounts/hi-five" },
    { label: "Wallet", href: "/accounts/wallet" },
    { label: "Settings", href: "/accounts/settings" },
    { label: "Privacy Rights", href: "/accounts/privacy-rights" },
];