# Estructura del Proyecto IntercambiARTE

## Descripción General
IntercambiARTE es una red social minimalista para el intercambio de bienes tokenizados como NFTs utilizando Story Protocol. La plataforma permite a los usuarios listar bienes físicos como NFTs, explorar categorías y transferir la propiedad de forma on-chain.

## Arquitectura del Proyecto

### Frontend (Next.js)
- **Páginas principales**:
  - Home: Página de inicio con información general
  - Explore: Visualización de bienes listados con filtros por categorías
  - ListItem: Formulario para registrar un nuevo bien como NFT
  - Profile: Perfil de usuario con sus bienes listados
  - ItemDetail: Detalles de un bien específico con opción de intercambio

- **Componentes**:
  - WalletConnect: Componente para conectar billetera MetaMask
  - ItemCard: Tarjeta para mostrar información resumida de un bien
  - CategoryFilter: Filtro de categorías
  - ImageUploader: Componente para subir imágenes a IPFS
  - TransferModal: Modal para iniciar transferencia de NFT

### Backend/Blockchain
- **Integración con Story Protocol**:
  - Registro de bienes como IP Assets
  - Creación de PILLs (términos de licencia)
  - Transferencia de propiedad de NFTs
  - Consulta de IPs registrados

- **Integración con IPFS/Pinata**:
  - Almacenamiento de imágenes
  - Almacenamiento de metadatos JSON

- **Integración con MetaMask**:
  - Autenticación de usuario
  - Firma de transacciones

## Requerimientos Técnicos

### Dependencias Principales
- Next.js (v14+)
- React (v18+)
- @storyprotocol/core-sdk
- ethers.js (v6+)
- wagmi (para integración con billeteras)
- axios (para peticiones HTTP)
- tailwindcss (para estilos)
- react-hook-form (para manejo de formularios)

### APIs y Servicios
- Story Protocol Anade Testnet
- Pinata API (para IPFS)
- MetaMask (o cualquier billetera compatible con EVM)

### Estructura de Archivos
```
intercambiarte/
├── public/
│   ├── images/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Layout.tsx
│   │   ├── ui/
│   │   │   ├── WalletConnect.tsx
│   │   │   ├── ItemCard.tsx
│   │   │   ├── CategoryFilter.tsx
│   │   │   ├── ImageUploader.tsx
│   │   │   └── TransferModal.tsx
│   │   └── index.ts
│   ├── pages/
│   │   ├── _app.tsx
│   │   ├── index.tsx
│   │   ├── explore.tsx
│   │   ├── list-item.tsx
│   │   ├── profile.tsx
│   │   └── item/[id].tsx
│   ├── utils/
│   │   ├── storyProtocol.ts
│   │   ├── ipfsUploader.ts
│   │   ├── walletUtils.ts
│   │   └── constants.ts
│   ├── hooks/
│   │   ├── useStoryProtocol.ts
│   │   ├── useIPFS.ts
│   │   └── useWallet.ts
│   ├── types/
│   │   ├── item.ts
│   │   └── user.ts
│   └── styles/
│       └── globals.css
├── .env.local
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## Funcionalidades MVP

1. **Conexión de Billetera**:
   - Conectar con MetaMask
   - Mostrar dirección de usuario conectado
   - Gestionar estado de conexión

2. **Listar un Bien (Crear NFT)**:
   - Formulario para ingresar datos del bien
   - Subir imagen a IPFS
   - Generar metadatos y subirlos a IPFS
   - Registrar el bien como IP Asset en Story Protocol

3. **Visualizar Bienes Listados**:
   - Mostrar todos los bienes tokenizados
   - Visualizar imagen, nombre, descripción y categoría
   - Mostrar propietario actual del NFT

4. **Buscar/Filtrar por Categoría**:
   - Filtrar bienes por categorías predefinidas
   - Interfaz intuitiva para selección de categorías

5. **Iniciar un Intercambio**:
   - Transferir propiedad del NFT a otra dirección
   - Interfaz para ingresar dirección del nuevo propietario

## Estructura de Datos

### Metadatos del NFT (JSON en IPFS)
```json
{
  "name": "Nombre del bien",
  "description": "Descripción detallada del bien",
  "image": "ipfs://[hash-de-la-imagen]",
  "attributes": [
    {
      "trait_type": "Categoría",
      "value": "Bicicletas"
    },
    {
      "trait_type": "Marca",
      "value": "Specialized"
    },
    {
      "trait_type": "Estado",
      "value": "Usado"
    }
  ],
  "category": "Bicicletas"
}
```

### Términos de Licencia (PILLs)
Para el MVP, se utilizarán términos de licencia simples que indiquen que el bien está disponible para intercambio:
- Transferible: true
- Minting Fee: 0
- Commercial Use: true/false (según corresponda)
- Derivatives Allowed: false (para bienes físicos)

## Flujo de Usuario
1. Usuario conecta su billetera
2. Usuario lista un bien (crea NFT)
3. Otros usuarios exploran bienes listados
4. Usuario interesado inicia intercambio (transferencia de NFT)
5. Propietario recibe notificación y confirma intercambio
6. Transferencia de propiedad se registra on-chain

## Consideraciones Técnicas
- Todas las transacciones se realizarán en la testnet Anade de Story Protocol
- Los metadatos e imágenes se almacenarán en IPFS a través de Pinata
- La interfaz de usuario será responsiva y amigable
- Se implementará manejo de errores para transacciones fallidas
- Se incluirán indicadores de carga durante las transacciones blockchain
