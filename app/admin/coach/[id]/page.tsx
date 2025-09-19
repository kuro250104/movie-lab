import { AvailabilityManager } from "./AvailabilityManager"

export default function CoachPage({ params }: { params: { id: string }}) {
    const coachId = Number(params.id)
    return (
        <div className="space-y-6">
            <AvailabilityManager coachId={coachId} />
        </div>
    )
}