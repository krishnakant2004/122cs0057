# Average Calculator HTTP Microservice

This microservice exposes a REST API that accepts qualified number IDs and calculates their average within a configured window size.

## Features

- REST API endpoint `/numbers/{numberID}` that accepts qualified number IDs
  - `p` for prime numbers
  - `f` for Fibonacci numbers
  - `e` for even numbers
  - `r` for random numbers
- Configurable window size (default: 10)
- Fetches multiple numbers from a third-party test server API
- Ensures stored numbers are unique (no duplicates in the window)
- Ignores responses taking longer than 500ms
- Maintains a sliding window of stored numbers
- Returns the previous and current state of the window, along with the calculated average

## API Endpoints

### Get Number and Calculate Average

```
GET /numbers/{numberType}
```

Where `{numberType}` is one of: `p`, `f`, `e`, or `r`.

#### Response Format
```
http://20.244.56.144/evaluation-service/e
```

# First Response
```json
{
  "windowPrevState": [],
  "windowCurrState": [2, 4, 6,8],
  "numbers": [2, 4, 6,8],
  "avg": 5.00
}
```

# second Response
```json
{
  "windowPrevState": [2,4,6,8],
  "windowCurrState": [12,14,16,18,20,22,24,26,28,30],
  "numbers": [12,14,16,18,20,22,24,26,28,30],
  "avg": 21
}
```

- `PORT`:  9876