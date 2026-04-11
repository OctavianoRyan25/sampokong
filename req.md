Saya ingin membuat web tour guide salah satu klenteng terbesar di Indonesia menggunakan react Js(jangan menggunakan TS) dan Firebase. Dimana nantinya flownya akan seperti di bawah

1. Secara default user akan membukan halaman untuk scan QRIS/unpaid nya. Jadi mungkin seperti hero section saja. Nantinya bisa dicek pada local storage untuk mendapatkan unique key dan expired date nya. Apabila belum 24 jam/expired nantinya bisa langsung masuk ke page yang sudah lolos middleware paid

2. user akan melakukan scan barcode web, lalu diarahkan ke halaman payment/unpaid web(mungkin akan menggunakan duidku/midtrans), setelah membayar akan redirect ke halaman yang sudah authenticated, nantinya terdapat expired date agar pengunjung tidak melakukan abuse

3. Setelah itu nantinya user akan mengaktifkan GPS untuk melakukan tracking titik saat ini, nantinya web akan melakukan scanning dengan interval tertentu untuk melakukan get destinasi, karena nantinya tiap destinasi akan ada video dan penjelasannya dam pastinya tiap destinasi ada titik koordinat yang akan dikirimkan oleh user secara tidak langsung

## arsitektur

1. ReactJS
2. Firebase
3. midtrans

## ERD

Struktur Firestore
Destinations (Collection):

id, name_id, name_en, name_cn

video_url, description_id, description_en, description_cn

latitude, longitude, radius (dalam meter)

Users (Collection):

uid, payment_status, expiry_date

p.s = Pastikan menggunakan nuansa chinese dan nantinya akan ada switch language ke ID, EN, CN
