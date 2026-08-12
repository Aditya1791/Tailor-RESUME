"""Configurable, bounded request timeout (issue #776).

The improve/tailor request timeout must be env-configurable (slow local LLMs
need more than 240s) but bounded so a stuck request can't hold a worker
indefinitely, and robust to blank/garbage env values (which must not crash
startup).
"""

from app.config import Settings


class TestRequestTimeoutSetting:
    def test_default_is_240(self):
        assert Settings.model_fields["request_timeout_seconds"].default == 240

    def test_clamps_below_minimum(self):
        assert Settings(request_timeout_seconds=5).request_timeout_seconds == 30

    def test_clamps_above_maximum(self):
        assert Settings(request_timeout_seconds=99999).request_timeout_seconds == 1800

    def test_accepts_in_range(self):
        assert Settings(request_timeout_seconds=900).request_timeout_seconds == 900

    def test_blank_string_falls_back_to_default(self):
        # A blank env var (REQUEST_TIMEOUT_SECONDS=) must not crash; defaults to 240.
        assert Settings(request_timeout_seconds="").request_timeout_seconds == 240

    def test_garbage_falls_back_to_default(self):
        assert Settings(request_timeout_seconds="abc").request_timeout_seconds == 240

    def test_float_string_is_coerced(self):
        assert Settings(request_timeout_seconds="300.0").request_timeout_seconds == 300

    def test_infinity_falls_back_to_default(self):
        # int(float("inf")) raises OverflowError — must not crash startup (PR #833 review).
        assert Settings(request_timeout_seconds="inf").request_timeout_seconds == 240

    def test_nan_falls_back_to_default(self):
        assert Settings(request_timeout_seconds="nan").request_timeout_seconds == 240


class TestSettingsResilience:
    def test_llm_provider_aliases_and_fallback(self):
        assert Settings(llm_provider="google").llm_provider == "gemini"
        assert Settings(llm_provider="claude").llm_provider == "anthropic"
        assert Settings(llm_provider="azure").llm_provider == "azure_foundry"
        assert Settings(llm_provider="OPENAI").llm_provider == "openai"
        assert Settings(llm_provider="  openai  ").llm_provider == "openai"
        assert Settings(llm_provider="").llm_provider == "openai"
        assert Settings(llm_provider="invalid_provider_xyz").llm_provider == "openai"

    def test_llm_model_fallback(self):
        assert Settings(llm_model="").llm_model == "gpt-5-nano-2025-08-07"
        assert Settings(llm_model="   ").llm_model == "gpt-5-nano-2025-08-07"
        assert Settings(llm_model="claude-3-5-sonnet").llm_model == "claude-3-5-sonnet"

    def test_log_levels_fallback(self):
        assert Settings(log_level="invalid").log_level == "INFO"
        assert Settings(log_level="debug").log_level == "DEBUG"
        assert Settings(log_llm="invalid").log_llm == "WARNING"
        assert Settings(log_llm="debug").log_llm == "DEBUG"

    def test_reasoning_effort_normalization(self):
        assert Settings(reasoning_effort="").reasoning_effort is None
        assert Settings(reasoning_effort="invalid").reasoning_effort is None
        assert Settings(reasoning_effort="HIGH").reasoning_effort == "high"

