import Card, { CardBody, CardTitle } from "./Card";
import Badge from "./Badge";
import Button from "./Button";

/**
 * BookingCard - แสดงการจองหนึ่งรายการในประวัติ
 */
export default function BookingCard({ booking, onCancel, onEdit }) {
  if (!booking) return null;

  const {
    _id,
    petName,
    appointmentDateTime,
    serviceId,
    status = "pending",
    customerName,
  } = booking;

  const service =
    serviceId && typeof serviceId === "object"
      ? serviceId
      : { name: "-" };

  const serviceName = service?.name || "-";

  const date = appointmentDateTime
    ? new Date(appointmentDateTime).toLocaleString("th-TH", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "-";

  const canEdit = status === "pending" || status === "confirmed";
  const canCancel = canEdit;

  const statusLabelMap = {
    pending: "รอดำเนินการ",
    confirmed: "ยืนยันแล้ว",
    completed: "เสร็จสิ้น",
    cancelled: "ยกเลิก",
  };

  return (
    <Card>
      <CardBody>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle className="flex-1 min-w-0">
            {serviceName}
          </CardTitle>
          <Badge status={status}>
            {statusLabelMap[status] || status}
          </Badge>
        </div>

        <p className="text-sm text-base-content/70">
          สัตว์เลี้ยง: <strong>{petName}</strong>
        </p>

        <p className="text-sm text-base-content/70">
          วันเวลา: {date}
        </p>

        {customerName && (
          <p className="text-sm text-base-content/60">
            ลูกค้า: {customerName}
          </p>
        )}

        {(canEdit || canCancel) && (
          <div className="mt-3 flex gap-2">
            {canEdit && onEdit && (
              <Button
                size="sm"
                onClick={() => onEdit(booking)}
              >
                แก้ไข
              </Button>
            )}

            {canCancel && onCancel && (
              <Button
                size="sm"
                variant="error"
                onClick={() => onCancel(_id)}
              >
                ยกเลิกการจอง
              </Button>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
