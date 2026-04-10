import React from "react";
import {
  Page,
  Text,
  Image,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

import logo from "../assets/ar.png";
import watermark from "../assets/ar.png";

// FONT
Font.register({
  family: "English",
  src: "/fonts/Roboto-Regular.ttf",
});
Font.register({
  family: "EnglishBold",
  src: "/fonts/Roboto-Bold.ttf",
  fontWeight: "bold",
});

// NUMBER TO WORDS
function numberToWords(num) {
  if (!Number.isFinite(num)) return "";
  const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine"];
  const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  if (num < 10) return ones[num];
  if (num < 20) return ["Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"][num-10];
  if (num < 100) return tens[Math.floor(num/10)] + " " + ones[num%10];
  if (num < 1000) return ones[Math.floor(num/100)] + " Hundred " + numberToWords(num%100);
  return num;
}

// STYLES
const styles = StyleSheet.create({
  page: { padding: 14, fontSize: 10, fontFamily: "English" },

  outerBox: {
    border: "1pt solid #000",
    padding: 12,
    position: "relative",
  },

  watermark: {
    position: "absolute",
    width: 260,
    height: 160,
    opacity: 0.05,
    left: "50%",
    marginLeft: -130,
    top: "50%",
    marginTop: -130,
  },

  // HEADER
  header: {
    flexDirection: "row",
    borderBottom: "2pt solid #000",
    paddingBottom: 10,
    alignItems: "center",
  },

  headerLeft: { width: "20%" },
  headerCenter: { width: "50%", textAlign: "center" },
  headerRight: {
    width: "30%",
    textAlign: "right",
    lineHeight: 1.6,
  },

  logo: { width: 70, height: 55 },

  shopTitle: {
    fontSize: 18,
    fontFamily: "EnglishBold",
    color: "#0a7db5",
  },

  address: { fontSize: 9, marginTop: 3 },

  invoiceTitle: {
    fontSize: 12,
    fontFamily: "EnglishBold",
    marginTop: 5,
  },

  // CUSTOMER
  customerBlock: {
    marginTop: 14,
    borderBottom: "1pt solid #000",
    paddingBottom: 10,
  },

  customerRow: {
    flexDirection: "row",
    marginTop: 8,
  },

  customerCol: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
  },

  label: {
    width: "30%",
    fontFamily: "EnglishBold",
  },

  value: {
    width: "70%",
    borderBottom: "1pt solid #000",
    marginLeft: 5,
  },

  // TABLE
  tableBox: {
    marginTop: 12,
    border: "1pt solid #000",
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0a7db5",
    color: "#fff",
    fontFamily: "EnglishBold",
  },

  th: {
    padding: 8,
    textAlign: "center",
  },

  tr: {
    flexDirection: "row",
    borderBottom: "0.5pt solid #ccc",
  },

  td: {
    padding: 8,
  },

  // TOTAL
  totalsBox: {
    marginTop: 14,
    width: "30%",
    alignSelf: "flex-end",
  },

  totalLine: {
    borderTop: "2pt solid #000",
    marginBottom: 6,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontFamily: "EnglishBold",
    fontSize: 12,
  },

  words: {
    marginTop: 10,
    fontFamily: "EnglishBold",
  },

  termsBox: {
    border: "1pt solid #ddd",
    marginTop: 14,
    padding: 10,
  },

  signature: {
    marginTop: 20,
    textAlign: "right",
    fontFamily: "EnglishBold",
  },

  thankText: {
    marginTop: 12,
    textAlign: "center",
    color: "#0a7db5",
    fontFamily: "EnglishBold",
  },
});

// DATE
const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString("en-GB") : "";

// PDF
const TamilPDF = ({
  invoiceNumber = 1,
  cart = [],
  customerName = "",
  customerPhoneNo = "",
  customerAddress = "",
  customerEmail = "",
  billDate,
}) => {
  const total = cart.reduce(
    (sum, item) => sum + item.saleprice * item.quantity,
    0
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.outerBox}>
          <Image src={watermark} style={styles.watermark} />

          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Image src={logo} style={styles.logo} />
            </View>

            <View style={styles.headerCenter}>
              <Text style={styles.shopTitle}>SAMPLE SHOP</Text>
              <Text style={styles.address}>Sample Address, Tamil Nadu</Text>
              <Text style={styles.invoiceTitle}>TAX INVOICE</Text>
            </View>

            <View style={styles.headerRight}>
              <Text>Phone: 1234567890</Text>
              <Text>Invoice: {String(invoiceNumber).padStart(3, "0")}</Text>
              <Text>Date: {formatDate(billDate)}</Text>
            </View>
          </View>

          {/* CUSTOMER */}
          <View style={styles.customerBlock}>
            <View style={styles.customerRow}>
              <View style={styles.customerCol}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.value}>{customerName}</Text>
              </View>

              <View style={styles.customerCol}>
                <Text style={styles.label}>Phone:</Text>
                <Text style={styles.value}>{customerPhoneNo}</Text>
              </View>
            </View>

            <View style={styles.customerRow}>
              <View style={styles.customerCol}>
                <Text style={styles.label}>Address:</Text>
                <Text style={styles.value}>{customerAddress}</Text>
              </View>

              <View style={styles.customerCol}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{customerEmail}</Text>
              </View>
            </View>
          </View>

          {/* TABLE */}
          <View style={styles.tableBox}>
            <View style={styles.tableHeader}>
              <Text style={[styles.th, { width: "8%" }]}>S.No</Text>
              <Text style={[styles.th, { width: "36%" }]}>Item</Text>
              <Text style={[styles.th, { width: "12%" }]}>Qty</Text>
              <Text style={[styles.th, { width: "14%" }]}>Rate</Text>
              <Text style={[styles.th, { width: "30%" }]}>Amount</Text>
            </View>

            {cart.map((item, i) => (
              <View key={i} style={styles.tr}>
                <Text style={[styles.td, { width: "8%" }]}>{i + 1}</Text>
                <Text style={[styles.td, { width: "36%" }]}>{item.name}</Text>
                <Text style={[styles.td, { width: "12%", textAlign: "center" }]}>
                  {item.quantity}
                </Text>
                <Text style={[styles.td, { width: "14%", textAlign: "right" }]}>
                  Rs. {item.saleprice}
                </Text>
                <Text style={[styles.td, { width: "30%", textAlign: "right" }]}>
                  Rs. {(item.quantity * item.saleprice).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>

          {/* TOTAL */}
          <View style={styles.totalsBox}>
            <View style={styles.totalLine}></View>
            <View style={styles.totalRow}>
              <Text>Total</Text>
              <Text>Rs. {total.toFixed(2)}</Text>
            </View>
          </View>

          <Text style={styles.words}>
            Amount in Words: {numberToWords(total)} Rupees
          </Text>

          {/* TERMS */}
          <View style={styles.termsBox}>
            <Text>1. No return after sale</Text>
            <Text>2. Payment immediate</Text>
            <Text style={styles.signature}>Signature</Text>
          </View>

         
        </View>
      </Page>
    </Document>
  );
};

export default TamilPDF;