import * as React from "react";
import { Html, Head, Preview, Body, Container, Heading, Text, Hr } from "@react-email/components";

type Props = {
    serviceName: string;
    clientName: string;
    dateISO: string;
    notes?: string;
};

export default function BookingEmail({ serviceName, clientName, dateISO, notes }: Props) {
    const date = new Date(dateISO);
    return (
        <Html>
            <Head />
            <Preview>Nouvelle réservation: {serviceName}</Preview>
            <Body style={{ fontFamily: "sans-serif", background: "#f6f7fb" }}>
                <Container style={{ background: "#fff", padding: "24px", borderRadius: 12 }}>
                    <Heading style={{ margin: 0 }}>✅ Nouvelle réservation</Heading>
                    <Text>Service: <b>{serviceName}</b></Text>
                    <Text>Client: <b>{clientName}</b></Text>
                    <Text>Date: <b>{date.toLocaleString()}</b></Text>
                    {notes && <Text>Notes: {notes}</Text>}
                    <Hr />
                    <Text style={{ color: "#64748b" }}>Cet e-mail a été envoyé automatiquement par Movilab.</Text>
                </Container>
            </Body>
        </Html>
    );
}