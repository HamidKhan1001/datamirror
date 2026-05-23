import datetime
import uuid
from sqlalchemy import Column, String, Float, DateTime, JSON, Integer, Boolean
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Scan(Base):
    """Browser fingerprinting & device analysis scan"""
    __tablename__ = "scans"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    fingerprint_hash = Column(String(64), index=True, nullable=False)
    browser_tier = Column(String(50), nullable=False)
    device_class = Column(String(50), nullable=False)
    network_class = Column(String(50), nullable=False)
    timezone_region = Column(String(100), nullable=False)
    language_group = Column(String(50), nullable=False)
    uniqueness_score = Column(Float, nullable=False)
    cpm_value = Column(Float, nullable=False)
    confidence_tier = Column(String(50), nullable=False)
    
    # Store complete unstructured readings (WebGL parameters, font list, canvas features, mouse movements)
    raw_data = Column(JSON, nullable=False)
    
    # Store the highly structured JSON analysis returned from Claude AI
    ai_analysis = Column(JSON, nullable=False)
    
    # Network & Location
    ip_address = Column(String(45), nullable=True, index=True)  # IPv4 or IPv6
    geolocation = Column(JSON, nullable=True)  # { lat, lng, city, country, etc }
    
    # Session tracking (optional for backward compatibility)
    session_id = Column(String(36), index=True, nullable=True)
    user_agent = Column(String(500), nullable=True)


class BrowserSession(Base):
    """Track user browser sessions across time"""
    __tablename__ = "browser_sessions"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    session_id = Column(String(36), unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    last_activity = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Session metadata
    fingerprint_hash = Column(String(64), index=True, nullable=False)
    ip_address = Column(String(45), nullable=True)
    browser_name = Column(String(100), nullable=True)
    os_name = Column(String(100), nullable=True)
    device_type = Column(String(50), nullable=True)
    
    # Session metrics
    page_visits = Column(Integer, default=0)
    total_time_ms = Column(Integer, default=0)
    mouse_moves = Column(Integer, default=0)
    keyboard_events = Column(Integer, default=0)
    scroll_events = Column(Integer, default=0)
    
    # Behavior data
    behavior_profile = Column(JSON, nullable=True)
    session_data = Column(JSON, nullable=True)


class UserBehavior(Base):
    """Track fine-grained user behavior patterns (heatmaps, scrolling, etc)"""
    __tablename__ = "user_behavior"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    session_id = Column(String(36), index=True, nullable=False)
    fingerprint_hash = Column(String(64), index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Mouse tracking
    mouse_positions = Column(JSON, nullable=True)  # [{ x, y, timestamp }]
    mouse_velocity = Column(Float, nullable=True)  # pixels per second
    mouse_pressure_pattern = Column(JSON, nullable=True)
    
    # Scroll behavior
    scroll_depth_percent = Column(Float, nullable=True)
    scroll_events_count = Column(Integer, default=0)
    scroll_pattern = Column(JSON, nullable=True)  # Velocity, pauses, direction changes
    
    # Keyboard behavior
    key_press_intervals = Column(JSON, nullable=True)  # Typing rhythm/dwell time
    key_press_count = Column(Integer, default=0)
    keyboard_profile = Column(JSON, nullable=True)
    
    # Click patterns
    click_count = Column(Integer, default=0)
    click_intervals = Column(JSON, nullable=True)
    double_click_ratio = Column(Float, nullable=True)
    
    # Focus behavior
    focus_switches = Column(Integer, default=0)
    blur_events = Column(Integer, default=0)
    idle_time_ms = Column(Integer, default=0)


class DeviceCapabilities(Base):
    """Track hardware & software capabilities"""
    __tablename__ = "device_capabilities"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    fingerprint_hash = Column(String(64), unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # Hardware
    cpu_cores = Column(Integer, nullable=True)
    device_memory_gb = Column(Integer, nullable=True)
    max_touch_points = Column(Integer, nullable=True)
    has_touch_support = Column(Boolean, default=False)
    
    # Display
    screen_width = Column(Integer, nullable=True)
    screen_height = Column(Integer, nullable=True)
    device_pixel_ratio = Column(Float, nullable=True)
    color_depth = Column(Integer, nullable=True)
    
    # Network
    network_type = Column(String(50), nullable=True)  # 4g, wifi, 5g, etc
    downlink_mbps = Column(Float, nullable=True)
    rtt_ms = Column(Integer, nullable=True)
    effective_type = Column(String(20), nullable=True)  # slow-2g, 2g, 3g, 4g
    
    # Capabilities
    has_webgl = Column(Boolean, default=False)
    has_webgl2 = Column(Boolean, default=False)
    has_canvas = Column(Boolean, default=False)
    has_web_audio = Column(Boolean, default=False)
    has_service_worker = Column(Boolean, default=False)
    has_indexeddb = Column(Boolean, default=False)
    
    capabilities_json = Column(JSON, nullable=True)
