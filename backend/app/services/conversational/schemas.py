from uuid import uuid4

from typing import Any, Optional

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)
    thread_id: str = Field(
        default_factory=lambda: uuid4().hex,
        min_length=1,
        max_length=100,
    )


class ChatResponse(BaseModel):
    answer: str
    model: str
    thread_id: str
    sql: Optional[str] = None
    data: Optional[list[dict[str, Any]]] = None
    row_count: Optional[int] = None
    show_table: Optional[bool] = None
    table_title: Optional[str] = None

