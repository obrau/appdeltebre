# Inicialitzar un nou projecte

## Pas 1
- Crear un nou repositori al GitHub.

## Pas 2
- Clonar aquest repositori.
```
git clone https://github.com/xus93/baseIonicApp.git
```
- Afegir branques de la base al nou projecte:
```
cd baseIonicApp
git remote add newRepo *ruta del nou repositori*
git push -u newRepo master
```

## Pas 3
- Crear un nou projecte a Firebase.
- Copiar arxiu de configuració per aplicacions web.
- Modificar fitxer /src/app/app.firebase.config.ts amb la nova configuració.
