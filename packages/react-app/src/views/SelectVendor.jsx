import { Button, notification, Badge, List } from "antd";
import React, { useEffect, useState } from "react";
import QrReader from "react-qr-reader";
import { CameraOutlined, QrcodeOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";

function SelectVendor({
  provider,
  userSigner,
  updateBalanceBuidl,
  contractBuidl,
  vendors,
  localChainId,
  paymasterAddress,
}) {
  const history = useHistory();
  const [scan, setScan] = useState(false);
  const [payUrl, setPayUrl] = useState();

  useEffect(() => {
    setPayUrl(`/pay?qr=ethereum%3Apay-${paymasterAddress}%40${localChainId}%2Ftransfer%3Faddress%3D`);
  }, [localChainId, paymasterAddress]);

  return (
    <div className="flex flex-col gap-3 max-w-[400px] my-4 mx-auto border-[1px] border-white p-4 rounded-lg shadow-xl shadow-black">
      <span className="flex text-center items-center justify-center my-2 text-2xl">Purchase Food</span>
      {scan ? (
        <div
          style={{
            zIndex: 256,
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
          }}
          onClick={() => {
            setScan(false);
          }}
        >
          <QrReader
            delay={250}
            resolution={1200}
            onError={e => {
              console.log("SCAN ERROR", e);
              setScan(false);
            }}
            onScan={newValue => {
              if (newValue) {
                console.log("SCAN VALUE", newValue);
                console.log("origin: ", window.location.origin);
                let url;
                if (newValue.startsWith("0x")) {
                  url = payUrl + newValue;
                } else if (newValue.startsWith(window.location.origin + "/pay")) {
                  url = newValue.split("/")[3];
                } else {
                  notification.error({
                    message: "Error Scanning QR code!",
                    description: "The QR code scanned is not valid.",
                    placement: "topRight",
                  });
                }
                console.log("url: ", url);
                if (url) {
                  history.push(url);
                }
                setScan(false);
              }
            }}
            style={{ width: "100%" }}
          />
        </div>
      ) : (
        <div
          style={{ marginTop: 4, cursor: "pointer" }}
          className="ant-btn ant-btn-primary"
          onClick={() => {
            setScan(!scan);
          }}
        >
          <Badge count={<CameraOutlined style={{ fontSize: 9 }} />}>
            <QrcodeOutlined style={{ fontSize: 18 }} />
          </Badge>{" "}
          <span className="ml-4">Scan Food Truck QR Code</span>
        </div>
      )}
      {/* <List
        className="flex flex-wrap justify-center"
        grid={{
          gutter: 2,
        }}
        dataSource={vendors}
        renderItem={vendor => {
          return (
            <List.Item className="m-5" key={vendor.value}>
              <Button
                style={{ width: 300, height: 300, fontSize: 32, whiteSpace: "normal" }}
                onClick={() => {
                  history.push(payUrl + vendor.value);
                }}
              >
                {vendor.label}
              </Button>
            </List.Item>
          );
        }}
      /> */}
    </div>
  );
}

export default SelectVendor;
