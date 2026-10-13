import "./ComingSoon.css";

export default function ComingSoon({ title }: { title: string }) {
    return (
        <section className="accountBlank">
            <h1 className="accountBlank__title">{title}</h1>
        </section>
    );
}