import os
import sys
from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool
from alembic import context

# 1. Add 'backend' directory to Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# 2. Get Alembic config object
config = context.config

# 3. Import your configuration and Base metadata
from app.core.config import settings
from app.core.database import Base
# Define models here to register in alembic
import app.models.expense
import app.models.user

# Interpret the config file for Python logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# 4. Target metadata for autogenerate
target_metadata = Base.metadata


def get_database_url() -> str:
    """
    Determines the database URL with the following precedence:
    1. Alembic CLI argument: -x url=<URL>
    2. Shell environment variable: DATABASE_URL
    3. Application settings: settings.SQLALCHEMY_DATABASE_URI
    """
    # 1. Check -x url=... argument
    x_args = context.get_x_argument(as_dictionary=True)
    if "url" in x_args:
        return x_args["url"]

    # 2. Check environment variable override
    env_url = os.getenv("DATABASE_URL")
    if env_url:
        return env_url

    # 3. Fallback to settings from local .env
    return str(settings.SQLALCHEMY_DATABASE_URI)


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = get_database_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    configuration = config.get_section(config.config_ini_section, {})
    configuration["sqlalchemy.url"] = get_database_url()

    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()