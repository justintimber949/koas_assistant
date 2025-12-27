# Database Schema (Tahap 1)

Storage Mechanism: `localStorage`
Key Format: `med_[collection_name]`

## 1. Patients Collection
**Key:** `med_patients`
**Type:** `Array<Object>`

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | String | Unique ID (PSxxx) | "PS001" |
| `name` | String | Patient Name | "Ny. S" |
| `status` | String | Active, Follow-up, Discharged | "Active" |
| `stase` | String | Clinical Department | "IPD" |
| `diagnosa` | String | Diagnosis Summary | "DM Type 2" |
| `dpjp` | String | Doctor in Charge | "dr. Ahmad" |
| `tags` | Array | Quick filter tags | ["urgent", "lab"] |

## 2. Tasks Collection
**Key:** `med_tasks`
**Type:** `Array<Object>`

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | Number | Unique ID | 1 |
| `text` | String | Task description | "Cek GDP Ny. S" |
| `deadline` | String | Human readable time | "Hari ini 09:00" |
| `tags` | Array | Priority/Type tags | ["urgent"] |
| `status` | String | pending / completed | "pending" |

## 3. SOAP Notes Collection
**Key:** `med_soap`
**Type:** `Array<Object>`

| Field | Type | Description |
|-------|------|-------------|
| `patientId` | String | Link to Patient ID |
| `patientName` | String | Denormalized name |
| `date` | String | Entry timestamp |
| `s` | String | Subjective |
| `o` | String | Objective |
| `a` | String | Assessment |
| `p` | String | Plan |

## 4. Configuration
**Key:** `med_assist_config`
**Type:** `Object`

```json
{
  "profile": {
    "name": "dr. User",
    "stase": "IPD",
    "dpjp": "dr. Supervisor"
  },
  "api": {
    "key": "AIzaSy...",
    "model": "gemini-2.5-flash"
  },
  "setupDate": "2024-12-28T..."
}
```
