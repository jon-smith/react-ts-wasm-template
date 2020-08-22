mod activity_calculator;
mod utils;

#[macro_use]
extern crate serde_derive;

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

#[wasm_bindgen(typescript_custom_section)]
const BEST_AVERAGE_RESULT_T: &'static str = r#"
type BestAverageResult = {
    distance: number;
    best: {
    startIndex: number;
    average: number;
    } | null;
}
"#;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "BestAverageResult[]")]
    pub type BestAverageResultArray;
}

#[wasm_bindgen]
pub fn best_averages_for_distances(
    data_points: Vec<f64>,
    distances: Vec<u32>,
) -> BestAverageResultArray {
    use wasm_bindgen::JsCast;

    let u64_distances = distances.into_iter().map(|d| d as u64).collect::<Vec<_>>();
    let results = activity_calculator::best_averages_for_distances(&data_points, &u64_distances);
    JsValue::from_serde(&results)
        .unwrap()
        .unchecked_into::<BestAverageResultArray>()
}
