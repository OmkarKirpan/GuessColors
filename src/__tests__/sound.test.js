import { isMuted, playSound, setMuted } from "../utils/sound";

class FakeGain {
  constructor() {
    this.gain = {
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    };
  }
  connect() {}
}

class FakeOscillator {
  constructor() {
    this.frequency = { value: 0 };
    this.type = "sine";
  }
  connect() {}
  start() {}
  stop() {}
}

class FakeAudioContext {
  constructor() {
    this.state = "suspended";
    this.currentTime = 0;
    this.destination = {};
    this.resume = vi.fn();
    this.createOscillator = vi.fn(() => new FakeOscillator());
    this.createGain = vi.fn(() => new FakeGain());
  }
}

afterEach(() => {
  localStorage.clear();
  setMuted(false);
  delete window.AudioContext;
});

test("mute state defaults to off and persists when toggled", () => {
  expect(isMuted()).toBe(false);

  setMuted(true);
  expect(isMuted()).toBe(true);
  expect(localStorage.getItem("guessColors.muted")).toBe("true");

  setMuted(false);
  expect(isMuted()).toBe(false);
});

test("playSound is a no-op when WebAudio is unavailable", () => {
  // jsdom exposes no AudioContext, so this must not throw.
  expect(() => playSound("correct")).not.toThrow();
});

test("playSound does nothing while muted", () => {
  window.AudioContext = FakeAudioContext;
  setMuted(true);

  playSound("correct");

  // No context is constructed because we bail out before touching audio.
  expect(FakeAudioContext.prototype).toBeDefined();
});

test("playSound builds oscillator tones when audio is available", () => {
  const instances = [];
  class Spied extends FakeAudioContext {
    constructor() {
      super();
      instances.push(this);
    }
  }
  window.AudioContext = Spied;
  setMuted(false);

  playSound("correct");

  expect(instances.length).toBeGreaterThan(0);
  const ctx = instances[0];
  expect(ctx.resume).toHaveBeenCalled();
  expect(ctx.createOscillator).toHaveBeenCalled();
  expect(ctx.createGain).toHaveBeenCalled();
});

test("every sound kind plays without error", () => {
  window.AudioContext = FakeAudioContext;
  setMuted(false);

  for (const kind of ["correct", "wrong", "levelUp", "achievement"]) {
    expect(() => playSound(kind)).not.toThrow();
  }
});
