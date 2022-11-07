import { React, useState, useEffect } from "react";

import Toast from "react-bootstrap/Toast";
import axiosInstance from "../../axiosApi";

export default function NotificationToast(props) {
  var timestamp = new Date(props.alert.timestamp);
  const [notificationText, setNotificationText] = useState("");
  const [notificationObject, setNotificationObject] = useState("");

  const [showB, setShowB] = useState(true);

  const toggleShowB = () => setShowB(!showB);

  useEffect(() => {
    if (props.alert?.target_content_type == "10") {
      setNotificationText(props.alert?.description);
      setNotificationObject("Partnerschaftsanfrage");
    } else if (props.alert?.target_content_type == "11") {
      const text = props.alert?.description;
      setNotificationText(text);
      setNotificationObject(`Auftrags-ID ${props.alert.target_object_id}`);
    } else {
      const text = "sonstige Benachrichtigung";
      setNotificationText(props.alert?.description);
      setNotificationObject("Allgemeine Benachrichtigung");
    }
  }, [alert]);

  const markasread = () =>
    axiosInstance
      .patch(`/alerts/${props.alert?.id}/`, {
        unread: false,
      })
      .then((res) => {
        toggleShowB();
      })
      .catch((err) => {
        console.log(err);
      });

  return (
    <Toast
      className="mb-2"
      bg="light"
      style={{ width: "100%" }}
      onClose={markasread}
      show={showB}
    >
      <Toast.Header>
        <strong className="me-auto">{notificationObject}</strong>
        <small>{timestamp.toLocaleString()}</small>
      </Toast.Header>
      <Toast.Body>{notificationText}</Toast.Body>
    </Toast>
  );
}
