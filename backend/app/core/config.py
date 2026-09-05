import json
from typing import Any, Literal
from pydantic import computed_field, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    ENVIRONMENT: Literal["development", "staging", "production"] = "development"
    PROJECT_NAME: str = "Expense Tracker API"
    API_V1_STR: str = "/api/v1"

    SECRET_KEY: str = "dev-insecure-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: int = 5433
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "expense_tracker"

    # Allow string, list, or JSON input from environment
    ALLOWED_ORIGINS: list[str] | str = [
        "http://localhost:3000",
        "http://localhost:5173",
    ]

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Any) -> list[str]:
        if isinstance(v, str):
            v = v.strip()
            if v.startswith("[") and v.endswith("]"):
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        elif isinstance(v, list):
            return [str(origin).strip() for origin in v]
        return []

    @computed_field
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        return (
            f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    @model_validator(mode="after")
    def validate_production_secrets(self) -> "Settings":
        if self.ENVIRONMENT == "production":
            if "insecure" in self.SECRET_KEY.lower() or len(self.SECRET_KEY) < 32:
                raise ValueError(
                    "FATAL: In production, SECRET_KEY must be a secure string of at least 32 characters."
                )
            if self.POSTGRES_PASSWORD in ("", "change_me_in_prod", "password"):
                raise ValueError(
                    "FATAL: Insecure or empty POSTGRES_PASSWORD is not allowed in production."
                )
        return self


settings = Settings()