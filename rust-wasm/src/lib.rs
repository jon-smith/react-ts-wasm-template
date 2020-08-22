mod utils;

use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// Call init before using any other code below
// This will give nice panic messages
#[wasm_bindgen]
pub fn init() {
    utils::set_panic_hook();
}

#[wasm_bindgen]
pub fn get_greeting() -> String {
    "hello 👋 browser, 💙 frm rust-wasm 🦀".into()
}

#[wasm_bindgen]
pub fn greet() {
    use web_sys::console;
    let greeting = get_greeting();
    console::log_1(&greeting.into());
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_we_used_the_crab_emoji() {
        let greeting = get_greeting();
        assert!(greeting.contains("🦀"));
    }
}