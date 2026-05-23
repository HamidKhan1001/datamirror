from sqlalchemy import create_engine, event
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.pool import NullPool, QueuePool
from app.config import settings
import logging

logger = logging.getLogger(__name__)

# Configure connection pool based on database type
connect_args = {}
poolclass = QueuePool

if settings.database_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
    poolclass = NullPool  # SQLite doesn't support connection pooling
    pool_size = None
    max_overflow = None
else:
    # PostgreSQL / Neon configuration
    pool_size = settings.db_pool_size
    max_overflow = settings.db_max_overflow

engine = create_engine(
    settings.database_url,
    connect_args=connect_args,
    poolclass=poolclass,
    pool_size=pool_size if settings.database_url.startswith("postgresql") else None,
    max_overflow=max_overflow if settings.database_url.startswith("postgresql") else None,
    pool_pre_ping=settings.db_pool_pre_ping,
    pool_recycle=settings.db_pool_recycle,
    echo=settings.log_level == "DEBUG",
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """Get database session for dependency injection"""
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        logger.error(f"Database session error: {e}")
        db.rollback()
        raise
    finally:
        db.close()

def init_db():
    """Initialize database tables"""
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables initialized")
    except Exception as e:
        logger.error(f"❌ Database initialization failed: {e}")
        raise
