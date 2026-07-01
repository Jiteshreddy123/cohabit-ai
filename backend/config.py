"""
Application configuration.

Uses Pydantic BaseSettings to read environment variables from .env.
All secrets and connection details live here — never hardcoded in routes.
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # ── Database ──────────────────────────────────────────────
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_NAME: str = "cohabit-ai_DB"
    DB_USER: str = "postgres"
    DB_PASSWORD: str = ""

    # ── JWT ───────────────────────────────────────────────────
    JWT_SECRET: str = "cohabit-ai-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    @property
    def DATABASE_URL(self) -> str:
        """Build the PostgreSQL connection string."""
        from urllib.parse import quote_plus
        encoded_password = quote_plus(self.DB_PASSWORD)
        return (
            f"postgresql://{self.DB_USER}:{encoded_password}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"



# Singleton instance — import this everywhere
settings = Settings()
