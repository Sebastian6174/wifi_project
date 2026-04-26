from typing import Literal

from pydantic import BaseModel, Field 

class IngestRequest(BaseModel):
    ingest_wifi: bool = Field(default=True, description="Ingresa el CSV de zonas WiFi.")
    ingest_connections: bool = Field(default=True, description="Ingresa el CSV de conexiones.")
    wifi_table: str = Field(default="zonas_wifi", min_length=1, max_length=128)
    connections_table: str = Field(default="conexiones_wifi", min_length=1, max_length=128)
    if_exists: Literal["fail", "replace", "append"] = "replace"
    chunksize: int = Field(default=10_000, gt=0, le=200_000)

