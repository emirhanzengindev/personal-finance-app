# Proje Adı

Bu proje, PostgreSQL veritabanına bağlantı ve Query Tool üzerinde sorgu çalıştırmayı içermektedir.

## Kurulum

1. PostgreSQL kurun (varsayılan port: 5432).
2. pgAdmin ile sunucu ekleyin:
   - Server Name: Yerel Postgres
   - Host: localhost
   - Port: 5432
   - Database: postgres
   - User: postgres
   - Password: (kurulumda verdiğiniz şifre)

## Kullanım

pgAdmin üzerinde **Query Tool** açarak şu sorgu ile bağlantıyı test edebilirsiniz:

```sql
SELECT version();
