#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BestAverage {
    pub start_index: u64,
    pub average: f64,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BestAverageResult {
    pub distance: u64,
    pub best: Option<BestAverage>,
}

fn sort_vec_unstable(input: &Vec<u64>) -> Vec<u64> {
    let mut to_sort = input.clone();
    to_sort.sort_unstable();
    to_sort
}

// Calculate the best average of the data points when the distance between indices is equal to the supplied distance
// Return results will be ordered by distance
pub fn best_averages_for_distances(
    data_points: &Vec<f64>,
    distances: &Vec<u64>,
) -> Vec<BestAverageResult> {
    struct IntermediateResult {
        pub distance: u64,
        pub max_sum: f64,
        pub start_index: Option<u64>,
    }

    let mut current_max_sums = sort_vec_unstable(distances)
        .into_iter()
        .filter(|d| d > &&0)
        .map(|d| IntermediateResult {
            distance: d,
            max_sum: 0.0,
            start_index: None,
        })
        .collect::<Vec<_>>();

    for i in 0..data_points.len() {
        for current_max in &mut current_max_sums {
            let to_index = i + current_max.distance as usize - 1;
            if to_index < data_points.len() {
                let sum = data_points[i..=to_index].iter().sum::<f64>();
                if current_max.start_index.is_none() || sum > current_max.max_sum {
                    current_max.max_sum = sum;
                    current_max.start_index = Some(i as u64);
                }
            }
        }
    }

    // Convert to output results
    current_max_sums
        .into_iter()
        .map(|m| BestAverageResult {
            distance: m.distance,
            best: match m.start_index {
                Some(x) => Option::Some(BestAverage {
                    start_index: x,
                    average: m.max_sum / (m.distance as f64),
                }),
                None => None,
            },
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    fn test_result(result: &BestAverageResult, average: f64, start_index: u64) {
        assert!(result.best.is_some());
        assert_eq!(result.best.as_ref().unwrap().average, average);
        assert_eq!(result.best.as_ref().unwrap().start_index, start_index);
    }

    #[test]
    fn test_simple_interval() {
        let input = vec![1., 1., 5., 5., 1., 1., 5., 5.];
        let distances = vec![1 as u64, 2, 3, 4, 5, 6];

        let result = best_averages_for_distances(&input, &distances);

        assert_eq!(result.len(), distances.len());

        test_result(&result[0], 5.0, 2);
        test_result(&result[1], 5.0, 2);
        test_result(&result[2], 11.0 / 3.0, 1);
        test_result(&result[3], 3.0, 0);
        test_result(&result[4], 17.0 / 5.0, 2);
        test_result(&result[5], 22.0 / 6.0, 2);
    }

    #[test]
    fn all_equal_input() {
        let input = vec![1., 1., 1., 1., 1., 1.];
        let distances = vec![1 as u64, 2, 3, 4, 5];

        let result = best_averages_for_distances(&input, &distances);

        assert_eq!(result.len(), distances.len());

        for r in &result {
            test_result(&r, 1.0, 0);
        }
    }

    #[test]
    fn invalid_distance() {
        let input = vec![1., 1., 1., 1., 1., 1.];
        let distances = vec![5 as u64, 10, 15];

        let result = best_averages_for_distances(&input, &distances);

        assert_eq!(result.len(), distances.len());

        test_result(&result[0], 1.0, 0);
        assert!(result[1].best.is_none());
        assert!(result[2].best.is_none());
    }
}
