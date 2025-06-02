# Documentación del Proyecto IntercambiARTE

## Descripción General

IntercambiARTE es una red social minimalista para el intercambio de bienes tokenizados como NFTs utilizando Story Protocol. La plataforma permite a los usuarios listar bienes físicos como NFTs, explorar categorías y transferir la propiedad de forma on-chain.

## Tecnologías Utilizadas

- **Frontend**: Next.js, React, TailwindCSS
- **Blockchain**: Story Protocol, Ethers.js
- **Almacenamiento**: IPFS/Pinata
- **Autenticación**: MetaMask (Web3)

## Estructura del Proyecto

```
intercambiarte/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Layout.tsx
│   │   └── ui/
│   │       ├── WalletConnect.tsx
│   │       ├── ItemCard.tsx
│   │       ├── CategoryFilter.tsx
│   │       ├── ImageUploader.tsx
│   │       └── TransferModal.tsx
│   ├── hooks/
│   │   ├── useStoryProtocol.ts
│   │   ├── useIPFS.ts
│   │   └── useWallet.ts
│   ├── pages/
│   │   ├── index.tsx
│   │   ├── explore.tsx
│   │   ├── list-item.tsx
│   │   └── profile.tsx
│   └── utils/
│       ├── storyProtocol.ts
│       └── ipfsUploader.ts
└── package.json
```

## Funcionalidades Implementadas

### 1. Conexión de Billetera
- Integración con MetaMask
- Gestión de estado de conexión
- Visualización de dirección de usuario

### 2. Registro de Bienes
- Formulario para ingresar datos del bien
- Subida de imágenes a IPFS
- Generación de metadatos y registro en Story Protocol

### 3. Exploración de Bienes
- Visualización de todos los bienes tokenizados
- Filtrado por categorías
- Interfaz intuitiva y responsive

### 4. Transferencia de Propiedad
- Modal para ingresar dirección del receptor
- Transferencia de NFT a nuevo propietario
- Confirmación de transacción

### 5. Perfil de Usuario
- Visualización de bienes propios
- Información de cuenta

## Instrucciones de Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd intercambiarte
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
Crear un archivo `.env.local` en la raíz del proyecto con las siguientes variables:
```
NEXT_PUBLIC_PINATA_JWT=tu_jwt_de_pinata
```

4. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

5. Abrir el navegador en `http://localhost:3000`

## Requisitos

- Node.js 18.0 o superior
- MetaMask instalado en el navegador
- Cuenta en Pinata para IPFS (para obtener un JWT)

## Consideraciones Técnicas

### Story Protocol
- El proyecto utiliza la testnet Anade de Story Protocol
- Es necesario tener tokens de prueba en la wallet para realizar transacciones

### IPFS/Pinata
- Se requiere un JWT de Pinata para la subida de archivos a IPFS
- Los metadatos e imágenes se almacenan de forma permanente en IPFS

### MetaMask
- Es necesario configurar MetaMask para la red Anade de Story Protocol
- URL RPC: https://rpc.aeneid.storyrpc.io/

## Limitaciones del MVP

- Los datos mostrados en la exploración son simulados para demostración
- No se implementa un sistema de notificaciones para ofertas o transferencias
- La funcionalidad de disputas no está implementada en esta versión

## Próximos Pasos

Para una versión completa de producción, se recomienda:

1. Implementar un sistema de ofertas y aceptación de intercambios
2. Añadir un sistema de reputación y feedback
3. Implementar notificaciones en tiempo real
4. Desarrollar un módulo de disputas utilizando el Dispute Module de Story Protocol
5. Mejorar la seguridad y validación de transacciones

## Soporte

Para cualquier consulta o soporte técnico, contactar a través de:
- Email: soporte@intercambiarte.com
- GitHub: [Abrir un issue](https://github.com/intercambiarte/issues)
