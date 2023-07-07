cd /etc/nginx/certificate
grep -e="Not After: " openssl x509 -text -noout -in nginx-certificate.crt
openssl req -new -newkey rsa:4096 -x509 -sha256 -days 365 -nodes -out nginx-certificate.crt -keyout nginx.key -subj "/C=PT/ST=Leiria/L=/O=Dis/CN=193.37.152.93"
