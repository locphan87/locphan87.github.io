---
title: Thinking in Ramda
date: 2018-01-20
tags:
  - javascript
  - functional-programming
  - ramda
---
Bài viết này dựa trên series [Thinking in Ramda](http://randycoulman.com/blog/categories/thinking-in-ramda/) của Randy Coulman.

Chúng ta sẽ cùng tìm hiểu:
- Các nguyên tắc cơ bản của lập trình hàm (functional programming).
- Cách sử dụng Ramda để áp dụng lập trình hàm vào Javascript.
- Cách tư duy theo hướng lập trình hàm để giải quyết các bài toán thực tế.

# Giới thiệu
Chúng ta sẽ sử dụng thư viện [Ramda](http://ramdajs.com/) cho loạt bài này, mặc dù nhiều ý tưởng có thể được áp dụng cho các thư viện JavaScript khác như [Underscore](http://underscorejs.org/) và [Lodash](https://lodash.com/), cũng như cho các ngôn ngữ khác.

## Ramda
[Ramda](https://ramdajs.com/) là một thư viện được thiết kế độc đáo, cung cấp rất nhiều công cụ cho lập trình hàm trong JavaScript một cách gọn gàng, dễ hiểu.

Nếu bạn muốn thử nghiệm với Ramda trong khi đọc qua loạt bài này, có một [môi trường thử nghiệm](http://ramdajs.com/repl/) trên trang web Ramda.

## Hàm (function)
Như tên gọi của nó, lập trình hàm có rất nhiều việc để làm với các hàm. Chúng ta sẽ định nghĩa một hàm như một đoạn code có thể tái sử dụng, được gọi với không hoặc nhiều đối số và trả về một kết quả.

Đây là một hàm đơn giản trong JavaScript:

```js
function double(x) {
  return x * 23
}
```

Với các hàm mũi tên (=>) của ES6, bạn có thể viết cùng một hàm theo cú pháp dễ dàng hơn nhiều.

```js
const double = (x) => x * 2
```

Hầu như mọi ngôn ngữ đều có một số hỗ trợ cho các hàm.

Một số ngôn ngữ cung cấp hỗ trợ cho các hàm như cấu trúc first-class (i.e JavaScript). Nghĩa là các hàm có thể được sử dụng trong cùng một cách như các kiểu giá trị khác. Bạn có thể:

- Sử dụng như hằng số và biến.
- Truyền vào như các tham số cho các hàm khác.
- Trả lại như kết quả từ các hàm khác.

## Hàm thuần khiết (pure function)
Khi viết các chương trình theo hướng lập trình hàm, điều quan trọng là chúng ta làm việc chủ yếu với các hàm "thuần khiết".

Các hàm thuần khiết là những hàm không có hiệu ứng phụ (side effects). Chúng không gán giá trị cho bất kỳ các biến bên ngoài, chúng không đọc hoặc ghi vào cơ sở dữ liệu, chúng không sửa đổi các tham số chúng được truyền vào, vv.

Ý tưởng cơ bản là, nếu bạn gọi một hàm với các tham số đầu vào giống nhau nhiều lần, bạn luôn nhận được một kết quả giống nhau.

Bạn chắc chắn có thể làm một số thứ với các hàm không thuần khiết (và bạn cần phải làm như vậy nếu chương trình của bạn muốn làm bất cứ điều gì có ý nghĩa), nhưng phần lớn trường hợp bạn sẽ muốn giữ cho hầu hết các hàm của bạn trở nên thuần khiết.

## Tính bất biến (immutability)
Một khái niệm quan trọng khác trong lập trình hàm là "tính bất biến". "Bất biến" (immutable) có nghĩa là "không thể thay đổi được".

Khi làm việc theo mô hình bất biến, một khi khởi tạo một giá trị hoặc một đối tượng bạn sẽ không bao giờ có thể thay đổi nó một lần nữa. Điều đó có nghĩa là sẽ không có sự thay đổi các phần tử của một mảng hoặc các thuộc tính của một đối tượng.

Thay vào đó, nếu cần phải thay đổi một cái gì đó trong một mảng hoặc đối tượng, bạn sẽ trả lại một bản sao mới của nó với giá trị đã được thay đổi. Các phần sau chúng ta sẽ nói về điều này một cách chi tiết.

Tính bất biến luôn đi cùng với các hàm thuần khiết. Vì các hàm thuần khiết không được phép có các hiệu ứng phụ, chúng không được phép thay đổi dữ liệu bên ngoài. Chúng buộc phải làm việc với dữ liệu theo cách không thể thay đổi.

## Bắt đầu từ đâu?
Cách dễ nhất để bắt đầu suy nghĩ theo hướng lập trình hàm là bắt đầu thay thế các vòng lặp (loop) bằng các hàm lặp trên tập hợp.

Nếu bạn đến từ một ngôn ngữ khác mà có các hàm này (Ruby và Smalltalk là hai ví dụ), bạn có thể đã quen thuộc với chúng.

[Martin Fowler](https://martinfowler.com/) có một vài bài viết tuyệt vời về "[Tập hợp đường ống](https://martinfowler.com/articles/collection-pipeline/)", cách sử dụng các hàm này và [cách tái cấu trúc code hiện có vào các tập hợp đường ống](https://martinfowler.com/articles/refactoring-pipelines.html).

Lưu ý rằng tất cả các hàm này (ngoại trừ `reject`) đều có sẵn trên `Array.prototype`, vì vậy bạn không cần Ramda để bắt đầu sử dụng chúng. Tuy nhiên, chúng ta sẽ sử dụng phiên bản của Ramda cho nhất quán với phần còn lại.

### forEach
Thay vì viết một vòng lặp rõ ràng, hãy thử sử dụng hàm `forEach` thay thế. Đó là:

```js
// Replace this:
for (const value of myArray) {
  console.log(value)
}

// with:
forEach((value) => console.log(value), myArray)
```

`forEach` nhận vào một hàm và một mảng, gọi hàm trên mỗi phần tử của mảng.

Trong khi `forEach` là cách dễ tiếp cận nhất của các hàm lặp này, nó lại ít được sử dụng nhất trong lập trình hàm. Nó không trả về một giá trị, vì vậy thực sự nó chỉ được sử dụng cho việc gọi các hàm có hiệu ứng phụ (side effects).

### map
Hàm quan trọng tiếp theo cần học là `map`. Giống như `forEach`, `map` áp dụng một hàm cho mỗi phần tử của mảng. Tuy nhiên, không giống như `forEach`, `map` thu thập các kết quả của việc áp dụng hàm vào một mảng mới và trả về nó.

Đây là một ví dụ:

```js
map((x) => x * 2, [1, 2, 3]) // --> [2, 4, 6]
```

Ví dụ trên sử dụng một hàm ẩn danh, nhưng chúng ta có thể dễ dàng sử dụng một hàm được đặt tên:

```js
const double = (x) => x * 2
map(double, [1, 2, 3])
```

### filter/reject
Tiếp theo, chúng ta hãy cũng xem xét `filter` và `reject`. Như tên gọi của nó, `filter` lựa chọn các phần tử từ một mảng dựa trên một hàm. Ví dụ:

```js
const isEven = (x) => x % 2 === 0
filter(isEven, [1, 2, 3, 4]) // --> [2, 4]
```

`filter` áp dụng hàm của nó (`isEven` trong trường hợp này) cho mỗi phần tử của mảng. Bất cứ khi nào hàm trả về giá trị đúng (truthy), phần tử tương ứng sẽ được bao gồm trong kết quả. Bất cứ khi nào hàm trả về giá trị sai (falsy), phần tử tương ứng sẽ bị loại trừ (bị lọc ra) khỏi mảng.

`reject` thực hiện chính xác như vậy, nhưng theo cách ngược lại. Nó giữ các phần tử mà hàm trả về giá trị sai và loại trừ các phần tử mà hàm trả về giá trị đúng.

```js
reject(isEven, [1, 2, 3, 4]) // --> [1, 3]
```

### find
`find` áp dụng một hàm cho mỗi phần của mảng và trả về phần tử đầu tiên mà hàm trả về giá trị đúng.

```js
find(isEven, [1, 2, 3, 4]) // --> 2
```

### reduce
`reduce` thì phức tạp hơn các hàm khác mà chúng ta đã thấy cho đến giờ.

`reduce` nhận vào một hàm hai đối số, một giá trị ban đầu, và mảng để vận hành.

Đối số đầu tiên của hàm mà chúng ta truyền vào được gọi là "giá trị tích lũy" (accumulator) và đối số thứ hai là phần tử từ mảng.

Hàm cần phải trả về một giá trị tích lũy mới.

Hãy xem xét một ví dụ và sau đó giải thích những gì đã xảy ra.

```js
const add = (accum, value) => accum + value
reduce(add, 5, [1, 2, 3, 4]) // --> 15
```

1.  `reduce` đầu tiên gọi hàm `add` với giá trị ban đầu (`5`) và phần tử đầu tiên của mảng (`1`). `add` trả lại một giá trị tích lũy mới (`5 + 1 = 6`).
2.  `reduce` gọi `add` lần nữa, lần này với giá trị tích lũy mới (`6`) và giá trị tiếp theo từ mảng (`2`). `add` trả về `8`.
3.  `reduce` gọi `add` một lần nữa với `8` và giá trị tiếp theo (`3`), kết quả là `11`.
4.  `reduce` gọi `add` lần cuối với `11` và giá trị cuối cùng của mảng (`4`), kết quả là `15`.
5.  `reduce` trả về giá trị tích lũy cuối cùng như là kết quả của nó (`15`).

## Kết luận

Bằng cách bắt đầu với các hàm lặp này, bạn có thể quen với ý tưởng truyền các hàm tới các hàm khác. Bạn có thể đã sử dụng chúng trong những ngôn ngữ khác mà không nhận ra bạn đã thực hành lập trình hàm.

# Kết hợp hàm
## Các kết hợp đơn giản
Một khi bạn đã quen với ý tưởng truyền hàm đến các hàm khác, bạn có thể bắt đầu tìm ra các tình huống mà bạn muốn kết hợp nhiều hàm với nhau.

Ramda cung cấp một số hàm để tạo các kết hợp đơn giản. Hãy nhìn vào một vài ví dụ.

### complement
Chúng ta đã sử dụng `find` để tìm số chẵn đầu tiên trong danh sách:

```js
const isEven = (x) => x % 2 === 0
find(isEven, [1, 2, 3, 4]) // --> 2
```

Điều gì sẽ xảy ra nếu chúng ta muốn tìm số lẻ đầu tiên. Chúng ta luôn có thể viết một hàm `isOdd` và sử dụng nó, nhưng chúng ta biết rằng bất kỳ số nào nếu không phải là chẵn thì là số lẻ. Chúng ta hãy sử dụng lại hàm `isEven`.

Ramda cung cấp một hàm bậc cao (higher order function) `complement`, nhận một hàm và trả về một hàm mới, trả về `true` khi hàm gốc trả về một giá trị `false` và `false` khi hàm gốc trả về một giá trị `true`.

```js
const isEven = (x) => x % 2 === 0
find(complement(isEven), [1, 2, 3, 4]) // --> 1
```

Thậm chí tốt hơn là cung cấp cho hàm bổ sung tên riêng để nó có thể được sử dụng lại:

```js
const isEven = (x) => x % 2 === 0
const isOdd = complement(isEven)
find(isOdd, [1, 2, 3, 4]) // --> 1
```

Lưu ý rằng `complement` thực hiện cùng một ý tưởng cho các hàm giống như là `!` (phủ định) áp dụng cho các giá trị.

### both/either
Giả sử rằng chúng ta đang làm việc trên một hệ thống bỏ phiếu. Với một người, chúng ta muốn có thể xác định xem người đó có đủ điều kiện bỏ phiếu hay không. Một người cần phải từ 18 tuổi trở lên và là một công dân mới có thể bỏ phiếu. Một người nào đó là công dân nếu họ sinh ra ở trong nước hoặc nếu sau đó họ trở thành công dân thông qua việc nhập quốc tịch.

```js
const wasBornInCountry = (person) => person.birthCountry === OUR_COUNTRY
const wasNaturalized = (person) => Boolean(person.naturalizationDate)
const isOver18 = (person) => person.age >= 18
const isCitizen = (person) => wasBornInCountry(person) || wasNaturalized(person)
const isEligibleToVote = (person) => isOver18(person) && isCitizen(person)
```

Những gì chúng ta đã viết ở trên chạy tốt, nhưng Ramda cung cấp một vài hàm hữu ích để giúp chúng ta viết nó gọn gàng hơn.

`both` nhận hai hàm và trả về một hàm mới, trả về `true` nếu cả hai hàm trả về một giá trị đúng khi áp dụng trên cùng tham số và `false` theo chiều ngược lại.

`either` nhận hai hàm và trả về một hàm mới, trả về `true` nếu một trong hai hàm trả về giá trị đúng khi áp dụng trên cùng tham số và `false` theo chiều ngược lại.

Sử dụng hai hàm này, chúng ta có thể đơn giản hóa `isCitizen` và `isEligibleToVote`:

```js
const isCitizen = either(wasBornInCountry, wasNaturalized)
const isEligibleToVote = both(isOver18, isCitizen)
```

Lưu ý rằng `both` thực hiện cùng một ý tưởng cho các hàm như toán tử && (và) đối với các giá trị và `either` thực hiện cùng một ý tưởng cho các hàm như || (hoặc) cho các giá trị.

Ramda cũng cung cấp `allPass` và `anyPass`, nhận một mảng bất kỳ số lượng các hàm. Như tên gọi của chúng, `allPass` hoạt động như `both`, và `anyPass` hoạt động như `either`.

## Đường ống (pipe)
Đôi khi chúng ta muốn áp dụng một số hàm cho một số dữ liệu theo kiểu đường ống. Ví dụ, chúng ta có thể muốn lấy hai con số, nhân chúng với nhau, cộng thêm một, và lấy bình phương của kết quả. Chúng ta có thể viết nó như sau:

```js
const multiply = (a, b) => a * b
const addOne = (x) => x + 1
const square = (x) => x * x
const operate = (x, y) => {
  const product = multiply(x, y)
  const incremented = addOne(product)
  const squared = square(incremented)
  return squared
}
operate(3, 4) // => ((3 * 4) + 1)^2 => (12 + 1)^2 => 13^2 => 169
```

Chú ý mỗi thao tác được áp dụng dựa trên kết quả của phép tính trước.

### pipe
Ramda cung cấp hàm `pipe`, nhận vào danh sách của một hoặc nhiều hàm và trả về một hàm mới.

Hàm mới có cùng số tham số như là hàm đầu tiên được đưa vào. Sau đó nó sẽ "truyền" (pipe) những tham số thông qua mỗi hàm trong danh sách. Nó áp dụng hàm đầu tiên cho các tham số, truyền kết quả của nó đến hàm thứ hai và vv. Kết quả của hàm cuối cùng là kết quả của lệnh gọi `pipe`.

Lưu ý rằng tất cả các hàm sau hàm đầu tiên phải chỉ có một tham số duy nhất.

Biết được điều này, chúng ta có thể sử dụng `pipe` để đơn giản hóa hàm operate của chúng ta:

```js
const operate = pipe(multiply, addOne, square)
```

Khi chúng ta gọi `operate(3, 4)`, `pipe` truyền `3` và `4` đến hàm `multiply`, kết quả là `12`. Nó truyền `12` đến `addOne`, trả về `13`. Sau đó nó gửi `13` đến `square`, trả lại `169`, và trở thành kết quả cuối cùng của `operate`.

### compose
Một cách khác chúng ta có thể viết hàm `operate` ban đầu của chúng ta là  lồng tất cả các tính toán tạm thời:

```js
const operate = (x, y) => square(addOne(multiply(x, y)))
```

Nhìn nó nhỏ gọn hơn, nhưng lại hơi khó đọc hơn. Tuy nhiên, nó có thể được viết lại bằng cách sử dụng hàm `compose` của Ramda.

`compose` hoạt động chính xác theo cùng cách với `pipe`, ngoại trừ việc áp dụng các hàm theo thứ tự từ phải sang trái (right to left) thay vì từ trái sang phải (left to right). Hãy viết lại `operate` với `compose`:

```js
const operate = compose(square, addOne, multiply)
```

Điều này hoàn toàn giống như `pipe` ở trên, nhưng với các hàm theo thứ tự ngược lại. Trên thực tế, hàm `compose` của Ramda được viết theo `pipe`.

Chúng ta có thể nghĩ đến `compose` theo cách này: `compose(f, g)(value)` tương đương với `f(g(value))`.

Với `compose`, lưu ý rằng tất cả các hàm ngoại trừ hàm cuối cùng chỉ có một tham số duy nhất.

### compose hay pipe?
`pipe` có lẽ là dễ hiểu nhất khi đến từ một nền tảng lập trình mệnh lệnh (imperative) khi bạn đọc các hàm từ trái sang phải. Tuy nhiên, `compose` thì dễ dàng hơn để chuyển đổi cho các hàm lồng nhau như đã chỉ ra ở trên.

Làm sao để nhận biết khi nào chọn `compose` và khi nào chọn `pipe`? Vì chúng tương đương nhau trong Ramda, có thể không quan trọng bạn chọn hàm nào. Hãy chọn bất kỳ cái nào tốt nhất trong tình huống của bạn.

## Kết luận
Bằng cách kết hợp các hàm theo những cách cụ thể, chúng ta có thể bắt đầu viết các hàm nhiều chức năng hơn.

Bạn có thể đã nhận thấy rằng chúng ta chủ yếu bỏ qua các tham số khi kết hợp các hàm. Chúng ta chỉ cung cấp các tham số khi chúng ta gọi hàm kết hợp.

Điều này là phổ biến trong lập trình hàm, và chúng ta sẽ nói về nó nhiều hơn nữa trong phần tiếp theo cũng như việc làm thế nào để kết hợp các hàm có nhiều hơn một tham số.

# Áp dụng từng phần
Trong phần trước, chúng ta đã xem xét các hàm đường ống đơn giản chỉ có một tham số. Vậy nếu chúng ta muốn sử dụng các hàm có nhiều hơn một tham số thì làm thế nào?

Ví dụ: giả sử chúng ta có một bộ sưu tập các quyển sách và chúng ta muốn tìm các tiêu đề của tất cả sách được xuất bản trong một năm nhất định. Chúng ta hãy cùng viết bằng cách chỉ sử dụng các hàm lặp trên tập hợp của Ramda.

```js
const publishedInYear = (book, year) => book.year === year
const titlesForYear = (books, year) => {
  const selected = filter((book) => publishedInYear(book, year), books)
  return map((book) => book.title, selected)
}
```

Sẽ rất tốt nếu có thể kết hợp `filter` và `map` vào một đường ống, nhưng chúng ta không biết làm thế nào bởi vì `filter` và `map` có hai tham số.

Tốt hơn nữa là chúng ta không cần phải sử dụng một hàm mũi tên trong `filter`. Hãy giải quyết vấn đề đó trước vì nó sẽ chỉ cho chúng ta một số điều chúng ta có thể sử dụng để làm đường ống.

## Hàm bậc cao (higher-order function)
Trong phần 1, chúng ta đã nói về các hàm như là các cấu trúc first-class. Các hàm có thể được truyền như các tham số cho các hàm khác và trả về như các kết quả từ các hàm khác. Chúng ta đã thực hành phần đầu tiên rất nhiều trước đây, nhưng chưa nhìn thấy phần sau đó.

Các hàm nhận hoặc trả về các hàm khác được gọi là các "hàm bậc cao".

Trong ví dụ ở trên, chúng ta truyền hàm mũi tên để  filter: `book => publishedInYear(book, year)` và chúng ta muốn cố gắng loại bỏ mũi tên. Để làm được điều đó, chúng ta cần một hàm mà nó nhận vào một cuốn sách và trả về giá trị đúng nếu cuốn sách được xuất bản trong một năm nhất định. Nhưng chúng ta cũng cần phải truyền vào số năm để làm cho hàm này linh hoạt.

Cách chúng ta có thể giải quyết vấn đề này là thay đổi `publishedInYear` thành một hàm trả về một hàm khác. Chúng ta sẽ viết nó với cú pháp hàm đầy đủ để xem những gì xảy ra, sau đó chúng ta sẽ viết một phiên bản ngắn hơn bằng cách sử dụng cú pháp mũi tên:

```js
// Full function version:
function publishedInYear(year) {
  return function (book) {
    return book.year === year
  }
}

// Arrow function version:
const publishedInYear = (year) => (book) => book.year === year
```

Với phiên bản mới của `publishedInYear`, chúng ta có thể viết lại lệnh gọi `filter`, loại bỏ hàm mũi tên:

```js
const publishedInYear = (year) => (book) => book.year === year
const titlesForYear = (books, year) => {
  const selected = filter(publishedInYear(year), books)
  return map((book) => book.title, selected)
}
```

Bây giờ, khi chúng ta gọi `filter`, `publishedInYear(year)` được đánh giá ngay lập tức, trả về một hàm nhận vào `book`, đó chính là những gì `filter` cần.

## Các hàm áp dụng từng phần (partial application)
Chúng ta có thể viết lại bất kỳ hàm nhiều tham số theo cách này nếu chúng ta muốn, nhưng chúng ta không sở hữu tất cả các hàm mà chúng ta có thể muốn sử dụng. Ngoài ra, chúng ta có thể muốn sử dụng một số hàm đa đối số theo cách thông thường.

Ví dụ: nếu chúng ta có một số code khác chỉ muốn kiểm tra xem một cuốn sách đã được xuất bản trong một năm nhất định hay không, chúng ta muốn gọi `publishedInYear(book, 2012)` nhưng chúng ta không thể làm được điều đó được nữa. Thay vào đó, chúng ta phải gọi `publishedInYear(2012)(book)`. Nó khó đọc và gây phiền toái hơn.

May mắn thay, Ramda cung cấp hai hàm để giúp chúng ta: `partial` và `partialRight`.

Hai hàm này cho phép chúng ta gọi bất kỳ hàm nào với ít tham số hơn nó cần. Cả hai đều trả lại một hàm mới, nhận vào các tham số và sau đó gọi các hàm ban đầu một khi tất cả các tham số đã được cung cấp.

Sự khác biệt giữa `partial` và `partialRight` là các tham số mà chúng ta cung cấp là các tham số bên trái nhất hoặc bên phải nhất cần thiết bởi hàm ban đầu.

Chúng ta hãy trở lại ví dụ ban đầu của chúng ta và sử dụng một trong những hàm này thay vì viết lại `publishedInYear`. Vì chúng ta chỉ muốn cung cấp số năm, và đó là tham số bên phải nhất, chúng ta cần phải sử dụng `partialRight`.

```js
const publishedInYear = (book, year) => book.year === year
const titlesForYear = (books, year) => {
  const selected = filter(partialRight(publishedInYear, [year]), books)
  return map((book) => book.title, selected)
}
```

Nếu chúng ta đã viết `publishedInYear` để nhận `(year, book)` thay vì `(book, year)`, chúng ta sẽ sử dụng `partial` thay vì `partialRight`.

Lưu ý rằng các đối số chúng ta cung cấp cho `partial` và `partialRight` phải luôn ở trong một mảng, ngay cả khi chỉ có một phần tử. Nếu quên điều đó, chúng ta sẽ thấy một thông báo lỗi khó hiểu:

```jsx
// First argument to _arity must be a non-negative integer no greater than ten
```

## Curry
Phải sử dụng `partial` và `partialRight` ở mọi nơi dẫn đến sự rườm rà và tẻ nhạt. Tuy nhiên, việc phải gọi hàm số nhiều tham số như một chuỗi các hàm đơn lẻ cũng không tốt.

May mắn thay, Ramda cung cấp cho chúng ta một giải pháp: `curry`.

[Currying](https://en.wikipedia.org/wiki/Currying) là một khái niệm cốt lõi trong lập trình hàm. Về mặt kỹ thuật, một hàm curried luôn là một chuỗi các hàm đơn tham số. Trong ngôn ngữ lập trình hàm thuần túy, cú pháp nói chung làm cho nó trông không khác gì gọi một hàm với nhiều tham số.

Nhưng bởi vì Ramda là một thư viện JavaScript, và JavaScript không có cú pháp tốt để gọi một loạt các hàm đơn tham số, các tác giả đã nới lỏng định nghĩa truyền thống của currying một chút.

Trong Ramda, một hàm curried có thể được gọi với một tập hợp con các tham số, và nó sẽ trả về một hàm mới chấp nhận các tham số còn lại. Nếu bạn gọi một hàm curried với tất cả các tham số của nó, nó sẽ thực thi hàm đó.

Bạn có thể nghĩ đến một hàm curried như là sự kết hợp tốt nhất của cả hai cách tiếp cận: bạn có thể gọi nó bình thường với tất cả các tham số của nó. Hoặc bạn có thể gọi nó với một tập hợp con các tham số, và nó sẽ hoạt động như thể bạn sử dụng `partial`.

Lưu ý rằng sự linh hoạt này dẫn đến một ảnh hưởng nhỏ về hiệu suất, bởi vì `curry` cần phải tìm hiểu hàm được gọi như thế nào và sau đó xác định cần phải làm gì. Nói chung, chỉ nên thực hiện curry hàm khi bạn thấy cần phải sử dụng `partial` ở nhiều nơi.

Chúng ta hãy áp dụng `curry` với hàm `publishedInYear`. Lưu ý rằng `curry` luôn hoạt động theo cách bạn đã từng sử dụng `partial`; không có phiên bản cho `partialRight`. Chúng ta sẽ nói về điều đó ở bên dưới, nhưng bây giờ, chúng ta sẽ đảo ngược các tham số cho `publishedInYear` để số năm như tham số đầu tiên.

```js
const publishedInYear = curry((year, book) => book.year === year)
const titlesForYear = (books, year) => {
  const selected = filter(publishedInYear(year), books)
  return map((book) => book.title, selected)
}
```

Chúng ta có thể một lần nữa gọi `publishedInYear` với số năm và trả lại một hàm, nhận vào một cuốn sách và thực hiện hàm ban đầu. Tuy nhiên, chúng ta vẫn có thể gọi nó theo cách thông thường `publishedInYear(2012, book)`.

## Thứ tự tham số
Lưu ý rằng để `curry` làm việc, chúng ta đã phải đảo ngược thứ tự tham số. Điều này là rất phổ biến với lập trình hàm, do đó, hầu như mỗi hàm của Ramda được viết để cho các dữ liệu cần thiết để vận hành như là tham số cuối cùng (data last).

Bạn có thể nghĩ về các tham số trước đó như là cấu hình cho tác vụ. Vì vậy, đối với `publishedInYear`, tham số `year` là cấu hình (chúng ta đang tìm kiếm cái gì?) Và tham số `book` là dữ liệu (chúng ta đang tìm kiếm nó ở đâu?).

Chúng ta đã thấy các ví dụ này với các hàm lặp trên tập hợp. Tất cả chúng đều nhận vào tập hợp như là tham số cuối cùng vì nó làm cho phong cách lập trình này dễ dàng hơn.

## Các tham số sai thứ tự
Điều gì sẽ xảy ra nếu chúng ta bỏ qua việc thay đổi thứ tự tham số của `publishedInYear`? Làm sao chúng ta vẫn có thể tận dụng được bản chất của curry?

Ramda cung cấp một vài lựa chọn.

### flip
Tùy chọn đầu tiên là `flip`. `flip` nhận một hàm của 2 hoặc nhiều tham số và trả về một hàm mới có các tham số tương tự, nhưng sẽ chuyển đổi thứ tự của hai tham số đầu tiên. Nó chủ yếu được sử dụng với hàm hai tham số, nhưng vẫn có thể được sử dụng trong các trường hợp tổng quát hơn.

Sử dụng `flip`, chúng ta có thể quay trở lại thứ tự tham số ban đầu của `publishedInYear`:

```js
const publishedInYear = curry((book, year) => book.year === year)
const titlesForYear = (books, year) => {
  const selected = filter(flip(publishedInYear)(year), books)
  return map((book) => book.title, selected)
}
```

Trong hầu hết các trường hợp, chúng ta sẽ ưu tiên sử dụng thứ tự tham số thuận tiện hơn, nhưng nếu bạn cần sử dụng một hàm mà bạn không kiểm soát được, `flip` là một lựa chọn hữu ích.

### placeholder
Tùy chọn tổng quát hơn là tham số "placeholder" (`__`).

Điều gì sẽ xảy ra nếu chúng ta có một hàm ba tham số, và chúng ta muốn cung cấp các tham số đầu tiên và cuối cùng, để lại tham số giữa? Chúng ta có thể sử dụng placeholder cho tham số ở giữa:

```js
const threeArgs = curry((a, b, c) => {
  /* ... */
})
const middleArgumentLater = threeArgs('value for a', __, 'value for c')
```

Bạn cũng có thể sử dụng placeholder nhiều lần trong một lần gọi. Ví dụ, nếu muốn chỉ cung cấp các tham số ở giữa?

```js
const threeArgs = curry((a, b, c) => {
  /* ... */
})
const middleArgumentOnly = threeArgs(__, 'value for b', __)
```

Chúng ta có thể sử dụng placeholder thay vì `flip` nếu chúng ta thích:

```js
const publishedInYear = curry((book, year) => book.year === year)
const titlesForYear = (books, year) => {
  const selected = filter(publishedInYear(__, year), books)
  return map((book) => book.title, selected)
}
```

Lưu ý rằng `__` chỉ hoạt động cho các hàm curried, trong khi `partial`, `partialRight`, và `flip` chạy trên tất cả các hàm. Nếu bạn cần sử dụng `__` với một hàm bình thường, bạn luôn có thể bao quanh nó với một lệnh gọi để `curry` trước.

## Hãy làm một đường ống
Hãy xem liệu chúng ta có thể di chuyển `filter` và `map` vào đường ống (pipe). Đây là trạng thái hiện tại của code, với thứ tự tham số thuận tiện cho `publishedInYear`:

```js
const publishedInYear = curry((year, book) => book.year === year)
const titlesForYear = (books, year) => {
  const selected = filter(publishedInYear(year), books)
  return map((book) => book.title, selected)
}
```

Chúng ta đã học được về `pipe` và `compose` trong phần trước đó, nhưng chúng ta cần thêm một thông tin nữa để có thể tận dụng điều đó.

Phần thông tin còn thiếu là: hầu như mọi hàm của Ramda đều được curried theo mặc định. Nó bao gồm `filter` và `map`. Vì vậy, `filter(publishedInYear(year))` là hoàn toàn hợp lệ và trả về một hàm mới, chờ chúng ta truyền vào `books` sau đó, tiếp theo là `map(book => book.title)`.

Và bây giờ chúng ta có thể tạo ra đường ống:

```js
const publishedInYear = curry((year, book) => book.year === year)
const titlesForYear = (books, year) =>
  pipe(
    filter(publishedInYear(year)),
    map((book) => book.title)
  )(books)
```

Chúng ta hãy đi thêm một bước nữa và đảo ngược các tham số cho `titlesForYear` để phù hợp với quy ước của Ramda về dữ liệu ở vị trí sau cùng. Chúng ta cũng có thể curry hàm để cho phép sử dụng nó trong các đường ống sau này.

```js
const publishedInYear = curry((year, book) => book.year === year)
const titlesForYear = curry((year, books) =>
  pipe(
    filter(publishedInYear(year)),
    map((book) => book.title)
  )(books)
)
```

## Kết luận
Áp dụng từng phần và currying có thể mất một thời gian và nỗ lực để trở nên quen thuộc với bạn. Nhưng một khi bạn "hiểu ra" chúng, chúng sẽ giới thiệu cho bạn một cách rất hữu ích để chuyển đổi dữ liệu của bạn theo hướng lập trình hàm.

Chúng sẽ dẫn bạn đến việc bắt đầu xây dựng các phép biến đổi bằng cách tạo ra những đường ống nhỏ, các khối xây dựng đơn giản (building block).

Để viết code theo phong cách lập trình hàm, chúng ta cần bắt đầu suy nghĩ "declaratively" thay vì "imperatively". Để làm được điều đó, chúng ta sẽ cần phải tìm ra những cách thể hiện các cấu trúc mệnh lệnh chúng ta đã quen thuộc theo cách thức lập trình hàm.

# Lập trình Declarative
Trong phần 3, chúng ta đã nói về việc kết hợp các hàm có nhiều hơn một tham số bằng cách sử dụng các kỹ thuật áp dụng từng phần và currying.

Khi chúng ta bắt đầu viết các hàm nhỏ để tạo nên các khối (block) và kết hợp chúng với nhau, chúng ta phải viết rất nhiều hàm bao gồm các toán tử của JavaScript như số học, so sánh, logic và luồng điều khiển. Điều này có thể cảm thấy tẻ nhạt, nhưng Ramda có thể giúp chúng ta.

Nhưng trước tiên, hãy cùng xem qua các kiến thức nền tảng.

## Imperative vs Declarative
Có nhiều cách khác nhau để phân chia các ngôn ngữ hay phong cách lập trình. Kiểu dữ liệu tĩnh và động, ngôn ngữ thông dịch so với ngôn ngữ biên dịch, cấp cao và cấp thấp, v.v ...

Một sự so sánh như vậy là lập trình imperative (bắt buộc, mệnh lệnh chi tiết) và declarative (khai báo, tuyên bố).

Nếu không đi quá sâu vào sự so sánh này, lập trình imperative là một phong cách lập trình mà các lập trình viên nói với máy tính phải làm gì bằng cách nói cho nó làm thế nào để làm điều đó (how). Lập trình imperative tạo ra rất nhiều cấu trúc mà chúng ta sử dụng hàng ngày: điều khiển luồng (`if`-`then`-`else` statement và vòng lặp), toán tử số học (`+`, `-`, `*`, `/`), toán tử so sánh (=,`>`, `<` , vv), và các toán tử logic (`&&`, `||`,`!`).

Lập trình declarative là một phong cách lập trình mà các lập trình viên nói với máy tính phải làm gì bằng cách nói với nó điều họ muốn (what). Máy tính sau đó phải tìm ra cách làm thế nào để đạt được kết quả.

Một trong những ngôn ngữ declarative cổ điển là Prolog. Trong Prolog, một chương trình bao gồm một tập hợp các sự kiện và một bộ quy tắc suy luận. Bạn khởi động chương trình bằng cách hỏi một câu hỏi, và công cụ suy luận của Prolog sử dụng các sự kiện và các quy tắc để trả lời câu hỏi của bạn.

Lập trình hàm được coi là một tập con của chương trình declarative. Trong một chương trình theo lập trình hàm, chúng ta xác định các hàm và sau đó cho máy tính biết phải làm gì bằng cách kết hợp các hàm này với nhau.

Ngay cả trong các chương trình declarative, chúng ta cũng cần làm những công việc tương tự như những chương trình imperative. Điều khiển luồng, số học, so sánh, và logic vẫn là các khối xây dựng cơ bản chúng ta phải làm việc cùng. Nhưng chúng ta cần phải tìm một cách để thể hiện những cấu trúc này theo hướng declarative.

## Những sự thay thế theo hướng declarative
Vì chúng ta đang lập trình bằng JavaScript, ngôn ngữ imperative, nên việc sử dụng các cấu trúc imperative khi viết mã JavaScript là một điều "bình thường".

Nhưng khi chúng ta tạo ra các biến đổi (transformations) bằng việc sử dụng đường ống và các cấu trúc tương tự, các cấu trúc imperative không hoạt động tốt.

Hãy nhìn vào một số khối xây dựng cơ bản mà Ramda cung cấp để giúp chúng ta thoát khỏi sự bất tiện này.

## Số học
Trở lại phần 2, chúng ta thực hiện một loạt các phép biến đổi số học để mô tả một đường ống:

```js
const multiply = (a, b) => a * b
const addOne = (x) => x + 1
const square = (x) => x * x
const operate = pipe(multiply, addOne, square)
operate(3, 4) // => ((3 * 4) + 1)^2 => (12 + 1)^2 => 13^2 => 169
```

Chú ý chúng ta phải viết các hàm cho tất cả các khối xây dựng cơ bản mà chúng ta muốn sử dụng.

Ramda cung cấp các hàm `add`, `subtract`, `multiply` và `divide` để sử dụng thay cho các toán tử số học tiêu chuẩn. Vì vậy, chúng ta có thể sử dụng phép nhân `multiply` của Ramda thay cho ký tự mà chúng ta đã viết, chúng ta có thể tận dụng hàm curried `add` của Ramda để thay thế `addOne` của chúng ta, và chúng ta có thể viết `square` bằng các phép nhân `multiply`:

```js
const square = (x) => multiply(x, x)
const operate = pipe(multiply, add(1), square)
```

`add(1)` rất giống với toán tử increment (`++`), nhưng toán tử increment điều chỉnh biến tăng lên và làm nó thay đổi, do đó nó là một mutation. Như chúng ta đã học trong phần 1, tính không thay đổi là nguyên lý cốt lõi của lập trình hàm nên chúng ta không muốn sử dụng `++` hoặc anh em của nó `--`.

Chúng ta có thể sử dụng `add(1)` và `subtract(1)` để incrementing và decrementing, nhưng vì hai tác vụ này là phổ biến nên Ramda cung cấp `inc` và `dec`.

Vì vậy, chúng ta có thể đơn giản hóa các đường ống của chúng ta một chút nữa:

```js
const square = (x) => multiply(x, x)
const operate = pipe(multiply, inc, square)
```

`subtract` là sự thay thế cho toán tử trừ `-`, nhưng cũng có toán tử `-` để phủ định một giá trị. Chúng ta có thể sử dụng `multiply(-1)`, nhưng Ramda cung cấp hàm phủ định `negate` để giúp thực hiện công việc này.

## So sánh
Cũng trong phần 2, chúng ta đã viết một số hàm để xác định xem một người có đủ điều kiện bỏ phiếu hay không. Phiên bản cuối cùng của code đó trông như sau:

```js
const wasBornInCountry = (person) => person.birthCountry === OUR_COUNTRY
const wasNaturalized = (person) => Boolean(person.naturalizationDate)
const isOver18 = (person) => person.age >= 18
const isCitizen = either(wasBornInCountry, wasNaturalized)
const isEligibleToVote = both(isOver18, isCitizen)
```

Lưu ý rằng một số hàm của chúng ta đang sử dụng toán tử so sánh tiêu chuẩn (`>=` và` ===` trong trường hợp này). Như bạn có thể dự đoán, Ramda cũng cung cấp những thay thế cho các toán tử này.

Hãy sửa đổi code của chúng ta để sử dụng `equals` thay thế` ===` và `gte` thay cho `>=`.

```js
const wasBornInCountry = (person) => equals(person.birthCountry, OUR_COUNTRY)
const wasNaturalized = (person) => Boolean(person.naturalizationDate)
const isOver18 = (person) => gte(person.age, 18)
const isCitizen = either(wasBornInCountry, wasNaturalized)
const isEligibleToVote = both(isOver18, isCitizen)
```

Ramda cũng cung cấp `gt` cho `>`, `lt` cho `<`, và `lte` cho `<=`.

Lưu ý rằng các hàm này nhận các tham số của chúng theo một thứ tự có vẻ bình thường (tham số đầu tiên lớn hơn cái thứ hai?). Điều này có ý nghĩa khi được sử dụng trong sự cô lập, nhưng có thể gây nhầm lẫn khi kết hợp các hàm. Các hàm này dường như vi phạm nguyên tắc "dữ liệu cuối cùng" của Ramda, vì vậy chúng ta phải cẩn thận khi sử dụng chúng trong các đường ống và các tình huống tương tự. Đó là khi `flip` và placeholder (`__`) sẽ có ích.

Bổ sung cho `equals`, có `identical` để xác định nếu hai giá trị tham chiếu cùng một bộ nhớ.

Có một vài trường hợp sử dụng phổ biến của` ===`: kiểm tra nếu một chuỗi hoặc mảng là rỗng (`str === ''` hoặc `arr.length === 0`), và kiểm tra nếu một biến là `null` hoặc `undefined`. Ramda cung cấp các hàm hữu ích cho cả hai trường hợp: `isEmpty` và `isNil`.

## Logic
Trong phần 2, chúng ta đã sử dụng các hàm `both` và `either` thay cho `&&` và `||`. Chúng ta cũng nói về việc dùng `complement` thay vì `!`

Những hàm kết hợp này hoạt động tốt khi cả hai hàm chúng ta kết hợp hoạt động trên cùng một giá trị. Trên đây, `wasBornInCountry`, `wasNaturalized`, và `isOver18` đều áp dụng cho một người `person`.

Nhưng đôi khi chúng ta cần áp dụng `&&`, `||`, và `!` cho các giá trị khác biệt. Đối với những trường hợp đó, Ramda cho chúng ta các hàm `and`, `or`, và `not`. Chúng ta có thể nghĩ về nó theo cách này: `and`, `or`, và `not` làm việc với các giá trị, trong khi cả `both`, `either`, và `complement` làm việc với các hàm.

Trường hợp sử dụng phổ biến của `||` là để cung cấp các giá trị mặc định. Ví dụ, chúng ta có thể viết như thế này:

```js
const lineWidth = settings.lineWidth || 80
```

Đây là một cách sử dụng phổ biến, và hoạt động đúng trong phần lớn trường hợp, tuy nhiên nó lại dựa vào định nghĩa "falsy" của JavaScript. Điều gì sẽ xảy ra nếu `0` là một giá hợp lệ? Vì `0` là falsy, chúng ta sẽ kết thúc với `lineWidth` là `80`.

Chúng ta có thể sử dụng hàm `isNil` mà chúng ta vừa học được ở trên, nhưng một lần nữa Ramda có một lựa chọn tốt hơn cho chúng ta: `defaultTo`.

```js
const lineWidth = defaultTo(80, settings.lineWidth)
```

`defaultTo` kiểm tra nếu đối số thứ hai với `isNil`. Nếu `false`, nó trả về giá trị đó, ngược lại thì nó trả về giá trị đầu tiên.

## Điều kiện
Điều khiển luồng là không cần thiết trong các chương trình theo lập trình hàm, nhưng đôi khi vẫn hữu ích. Các hàm lặp trên tập hợp mà chúng ta đã nói ở phần 1 bao gồm hầu hết các tình huống lặp, nhưng các cấu trúc điều kiện vẫn còn quan trọng.

### ifElse
Chúng ta hãy viết một hàm, `forever21`, nhận vào một số tuổi và trả về tuổi tiếp theo. Nhưng, như tên của nó, một khi đến 21 tuổi, nó sẽ luôn như vậy.

```js
const forever21 = (age) => (age >= 21 ? 21 : age + 1)
```

Lưu ý rằng điều kiện của chúng ta (`age >= 21`) và nhánh thứ hai (`age + 1`) đều có thể được viết theo hàm của độ tuổi `age`. Chúng ta có thể viết lại nhánh đầu tiên (`21`) như một hàm không đổi (`() => 21`). Bây giờ chúng ta có ba hàm mà có (hoặc bỏ qua) `age`.

Bây giờ chúng ta đang ở một vị trí mà chúng ta có thể sử dụng `ifElse` của Ramda, tương đương với cấu trúc `if... then...else` hoặc người anh em họ ngắn hơn, toán tử thứ ba (`?:`).

```js
const forever21 = (age) => ifElse(gte(__, 21), () => 21, inc)(age)
```

Như đã đề cập ở trên, các hàm so sánh không hoạt động như chúng ta mong muốn khi kết hợp các hàm, vì vậy chúng ta buộc phải sử dụng placeholder ở đây (`__`). Chúng ta cũng có thể chuyển sang `lte`:

```js
const forever21 = (age) => ifElse(lte(21), () => 21, inc)(age)
```

Trong trường hợp này, chúng ta phải đọc cái này là "21 nhỏ hơn hoặc bằng số tuổi".

### Hằng số
Các hàm hằng số khá hữu ích trong các tình huống như thế này. Như bạn có thể tưởng tượng, Ramda cung cấp cho chúng ta một con đường tắt. Trong trường hợp này, nó được đặt tên là `always`.

```js
const forever21 = (age) => ifElse(gte(__, 21), always(21), inc)(age)
```

Ramda cũng cung cấp `T` và `F` thay cho `always(true)` và `always(false)`.

### identity
Hãy thử một hàm khác, `alwaysDrivingAge`. Hàm này nhận một giá trị thời gian và trả lại chính nó nếu nó là `gte` 16. Nhưng nếu nó nhỏ hơn 16, nó sẽ trả về 16. Điều này cho phép bất cứ ai giả vờ rằng họ đang ở tuổi lái xe, ngay cả khi họ không phải vậy.

```js
const alwaysDrivingAge = (age) => ifElse(lt(__, 16), always(16), (a) => a)(age)
```

Nhánh thứ hai của điều kiện (`a => a`) là một mô hình (pattern) phổ biến trong lập trình hàm. Nó được gọi là hàm nhận dạng (identity). Tức là, một hàm trả lại bất kỳ tham số nào được đưa vào.

Như bạn có thể giả định, Ramda cung cấp hàm `identity` cho chúng ta.

```js
const alwaysDrivingAge = (age) => ifElse(lt(__, 16), always(16), identity)(age)
```

`identity` có thể có nhiều hơn một tham số, nhưng nó luôn trả về tham số đầu tiên. Nếu chúng ta muốn trả về một cái gì đó khác với tham số đầu tiên, thì hàm `nthArg` tổng quát hơn. Tuy nhiên, nó ít phổ biến hơn `identity`.

### when và unless
Có một câu lệnh `ifElse`, trong đó một trong các nhánh có điều kiện là `identity` cũng khá phổ biến, do đó Ramda cung cấp một số cách viết tắt cho chúng ta.

Nếu, như trong trường hợp của chúng ta, nhánh thứ hai là `identity`, chúng ta có thể sử dụng `when` thay vì `ifElse`:

```js
const alwaysDrivingAge = (age) => when(lt(__, 16), always(16))(age)
```

Nếu nhánh đầu tiên của điều kiện là `identity`, chúng ta có thể sử dụng `unless`. Nếu chúng ta đảo ngược điều kiện của chúng ta để sử dụng `gte(__, 16)`, chúng ta có thể sử dụng `unless`.

```js
const alwaysDrivingAge = (age) => unless(gte(__, 16), always(16))(age)
```

### cond
Ramda cũng cung cấp hàm `cond` để có thể thay thế `switch` hoặc một chuỗi các câu lệnh `if...then...else`.

```js
const water = (temperature) =>
  cond([
    [equals(0), always('water freezes at 0°C')],
    [equals(100), always('water boils at 100°C')],
    [T, (temp) => `nothing special happens at ${temp}°C`],
  ])(temperature)
```

## Kết luận
Chúng ta đã cùng xem xét một số hàm mà Ramda cung cấp để chuyển đổi code từ imperative sang declarative.

Bạn có thể nhận thấy rằng vài hàm cuối cùng chúng ta đã viết (`forever21`, `drivingAge`, and `water`) tất cả đều nhận vào một tham số, xây dựng một hàm mới và sau đó áp dụng hàm đó cho tham số.

Đây là một mô hình phổ biến, và một lần nữa Ramda cung cấp các công cụ để làm gọn cấu trúc này. Phần tiếp theo, Pointfree Style sẽ xem xét làm thế nào để đơn giản hóa các hàm theo mẫu này.

# Pointfree style
Trong phần 4, chúng ta đã nói về việc viết code theo cách declarative (nói với máy tính phải làm gì) thay vì imperative (nói với máy tính làm như thế nào).

Bạn có thể nhận thấy rằng một vài hàm mà chúng ta đã viết (`forever21`, `drivingAge` và `water`) đều nhận vào một tham số, xây dựng một hàm mới và sau đó áp dụng hàm đó cho tham số.

Đây là một mô hình rất phổ biến trong lập trình hàm, và một lần nữa Ramda cung cấp các công cụ để làm gọn cách viết này.

## Pointfree style
Có hai nguyên tắc chính của Ramda mà chúng ta đã nói tới trong phần 3:
- Đặt dữ liệu cuối cùng
- Curry tất cả mọi thứ

Hai nguyên tắc này dẫn đến một phong cách mà các lập trình viên hàm gọi là "pointfree".

Có một bài viết tuyệt vời, [Why Ramda?](http://fr.umio.us/why-ramda/), minh họa phong cách pointfree rất hay.

Chúng ta chưa có các công cụ cần thiết để làm cho tất cả các ví dụ của chúng ta hoàn toàn pointfree, nhưng chúng ta có thể bắt đầu.

Chúng ta hãy nhìn vào `forever21`:

```js
const forever21 = (age) => ifElse(gte(__, 21), always(21), inc)(age)
```

Lưu ý rằng độ tuổi `age` chỉ xuất hiện hai lần: một lần trong danh sách tham số và một lần ở cuối của hàm khi chúng ta áp dụng hàm mới được trả về bởi `ifElse`.

Nếu chúng ta để ý trong khi làm việc với Ramda, chúng ta sẽ thấy mẫu này rất nhiều. Nó có nghĩa là có một cách để chuyển đổi hàm sang phong cách pointfree.

Hãy xem nó sẽ như thế nào:

```js
const forever21 = ifElse(gte(__, 21), always(21), inc)
```

Và, poof! Chúng ta vừa làm cho số tuổi `age` biến mất. Phong cách pointfree. Lưu ý rằng không có sự khác biệt về hành vi trong hai phiên bản này. Chúng ta vẫn trả lại một hàm nhận vào số tuổi, nhưng bây giờ chúng ta không chỉ rõ tham số tuổi `age`.

Chúng ta có thể làm tương tự với `alwaysDrivingAge` và `water`.

Trong bài viết trước, `alwaysDrivingAge` trông như sau:

```js
const alwaysDrivingAge = (age) => ifElse(lt(__, 16), always(16), identity)(age)
```

Chúng ta có thể áp dụng cùng một phép biến đổi để làm cho nó trở nên pointfree.

```js
const alwaysDrivingAge = when(lt(__, 16), always(16))
```

Và đây là cách chúng ta đã viết `water`:

```js
const water = (temperature) =>
  cond([
    [equals(0), always('water freezes at 0°C')],
    [equals(100), always('water boils at 100°C')],
    [T, (temp) => `nothing special happens at ${temp}°C`],
  ])(temperature)
```

Và đây là `water` theo phong cách pointfree:

```js
const water = cond([
  [equals(0), always('water freezes at 0°C')],
  [equals(100), always('water boils at 100°C')],
  [T, (temp) => `nothing special happens at ${temp}°C`],
])
```

## Hàm đa tham số (multi-argument-functions)

Vậy các hàm có nhiều hơn một tham số thì sao ? Chúng ta hãy nhìn lại ví dụ `titlesForYear` từ phần 3.

```js
const titlesForYear = curry((year, books) =>
  pipe(
    filter(publishedInYear(year)),
    map((book) => book.title)
  )(books)
)
```

Lưu ý rằng `books` chỉ xuất hiện hai lần: một lần là tham số cuối cùng trong danh sách đối số (dữ liệu cuối cùng!), Và một lần ở cuối của hàm khi chúng ta áp dụng đường ống vào nó. Điều này cũng tương tự như mô hình chúng ta thấy với độ tuổi ở trên, do đó hãy áp dụng cùng một sự chuyển đổi với nó:

```js
const titlesForYear = (year) =>
  pipe(
    filter(publishedInYear(year)),
    map((book) => book.title)
  )
```

Nó hoạt động! Bây giờ chúng ta có một phiên bản pointfree cho `titlesForYear`.

Thực tế thì chúng ta sẽ không hướng tới phong cách pointfree trong trường hợp này vì JavaScript không làm cho việc gọi hàm với một loạt các tham số được thuận tiện, như chúng ta đã thảo luận trong các bài viết trước đó.

Nếu chúng ta muốn sử dụng `titlesForYear` trong một đường ống, nó vẫn ổn. Chúng ta có thể gọi `titleForYear(2012)` rất dễ dàng. Nhưng nếu chúng ta muốn sử dụng nó một cách tự nhiên, chúng ta phải quay trở lại mô hình `}(` mà chúng ta đã thấy trong bài trước: `titlesForYear(2012)(books)`. Điều đó không đáng để đánh đổi.

Nhưng bất cứ lúc nào có hàm một tham số theo (hoặc có thể được refactor để theo) mô hình trên, bạn sẽ có thể làm cho nó pointfree.

## Refactor thành pointfree
Sẽ có những lúc các hàm của chúng ta không theo khuôn mẫu. Chúng ta có thể đang vận hành trên dữ liệu nhiều lần trong cùng một hàm.

Đây là trường hợp trong một số ví dụ trong phần 2. Trong những ví dụ này, chúng ta đã tái cấu trúc code để kết hợp các hàm bằng cách sử dụng `both`, `either`, `pipe` và `compose`. Một khi chúng ta đã thực hiện điều đó, làm cho các hàm của chúng ta pointfree là một sự chuyển đổi tương đối dễ dàng.

Chúng ta hãy nhìn lại ví dụ `isEligibleToVote`. Đây là nơi chúng ta bắt đầu:

```js
const wasBornInCountry = (person) => person.birthCountry === OUR_COUNTRY
const wasNaturalized = (person) => Boolean(person.naturalizationDate)
const isOver18 = (person) => person.age >= 18
const isCitizen = (person) => wasBornInCountry(person) || wasNaturalized(person)
const isEligibleToVote = (person) => isOver18(person) && isCitizen(person)
```

Hãy bắt đầu với `isCitizen`. Nó nhận vào một người `person` và sau đó áp dụng hai hàm khác nhau cho người đó, kết hợp các kết quả với `||`. Như chúng ta đã học trong phần 2, chúng ta có thể sử dụng `either` để kết hợp hai hàm vào một hàm số mới trước, và sau đó áp dụng hàm kết hợp với người đó `person`.

```js
const isCitizen = (person) => either(wasBornInCountry, wasNaturalized)(person)
```

Chúng ta có thể làm điều tương tự với `isEligibleToVote` bằng `both`:

```js
const isEligibleToVote = (person) => both(isOver18, isCitizen)(person)
```

Bây giờ chúng ta đã thực hiện việc tái cấu trúc này, chúng ta có thể thấy rằng cả hai hàm đều làm theo mô hình chúng ta đã nói ở trên: `person` được nhắc đến hai lần, một lần là tham số hàm, và một lần ở cuối khi chúng ta áp dụng hàm kết hợp với nó. Bây giờ chúng ta có thể refactor theo phong cách pointfree:

```js
const isCitizen = either(wasBornInCountry, wasNaturalized)
const isEligibleToVote = both(isOver18, isCitizen)
```

## Tại sao?
Phong cách pointfree cần có thời gian để làm quen. Có thể khó để thích ứng với các tham số dữ liệu bị thiếu ở mọi nơi. Điều quan trọng là phải có một sự quen thuộc với các hàm của Ramda để biết có bao nhiêu tham số cần thiết.

Nhưng một khi bạn đã quen với nó, nó sẽ trở nên rất có giá trị để có một loạt các hàm pointfree nhỏ kết hợp với nhau theo những cách thú vị.

Lợi thế của phong cách pointfree là gì? Có người lập luận rằng đó chỉ là một bài tập học thuật được thiết kế để giành được huy hiệu mệnh danh lập trình hàm. Tuy nhiên, nó có một vài lợi thế, mặc dù phải mất thời gian để làm quen:

- Nó làm cho các chương trình đơn giản và súc tích hơn (Đây không phải luôn luôn là một điều tốt).
- Nó làm cho các thuật toán rõ ràng hơn. Bằng cách chỉ tập trung vào các hàm được kết hợp, chúng ta có được một cảm nhận tốt hơn về những gì đang xảy ra khi không có các tham số dữ liệu.
- Nó buộc chúng ta suy nghĩ nhiều hơn về việc chuyển đổi đang được thực hiện hơn là về dữ liệu đang được chuyển đổi.
- Nó giúp chúng ta suy nghĩ về các hàm của chúng ta như các khối xây dựng thông thường, có thể làm việc với các loại dữ liệu khác nhau, hơn là nghĩ về chúng như các hoạt động trên một loại dữ liệu cụ thể. Bằng cách cung cấp cho dữ liệu một cái tên, chúng ta đang hạn chế suy nghĩ của chúng ta về nơi mà chúng ta có thể sử dụng hàm. Bằng cách bỏ qua dữ liệu, nó cho phép chúng ta sáng tạo hơn.

## Kết luận
Phong cách pointfree, còn được gọi là [tacit programming](https://en.wikipedia.org/wiki/Tacit_programming), có thể làm cho code của chúng ta rõ ràng và dễ hiểu hơn. Bằng cách tái cấu trúc code của chúng ta để kết hợp tất cả biến đổi của chúng ta thành một hàm duy nhất, chúng ta sẽ kết thúc với các khối xây dựng nhỏ hơn, có thể được sử dụng ở nhiều nơi hơn.

Trong ví dụ của chúng ta, chúng ta đã không thể refactor tất cả mọi thứ thành pointfree. Chúng ta vẫn có code được viết theo cách imperative. Hầu hết các code này xử lý các đối tượng và mảng.

Chúng ta cần tìm những cách tương tác khác với các đối tượng và mảng. Vậy tính bất biến thì sao? Làm thế nào để chúng ta thao tác với các đối tượng và mảng theo cách bất biến?

# Tính bất biến và đối tượng
Trong phần 5, chúng ta đã nói về cách viết các hàm của chúng ta theo kiểu "pointfree" hoặc "tacit", khi mà đối số chính của hàm không được hiển thị rõ ràng.

Vào thời điểm đó, chúng ta đã không thể chuyển đổi tất cả các hàm thành pointfree bởi vì chúng ta thiếu một số công cụ. Đã đến lúc học các công cụ này.

## Đọc thuộc tính của đối tượng
Chúng ta hãy nhìn lại ví dụ về các cử tri hợp lệ trong phần 5:

```js
const wasBornInCountry = (person) => person.birthCountry === OUR_COUNTRY
const wasNaturalized = (person) => Boolean(person.naturalizationDate)
const isOver18 = (person) => person.age >= 18
const isCitizen = either(wasBornInCountry, wasNaturalized)
const isEligibleToVote = both(isOver18, isCitizen)
```

Như bạn thấy, chúng ta đã chuyển đổi `isCitizen` và `isEligibleToVote` thành pointfree, nhưng chúng ta không thể làm điều đó với ba hàm đầu tiên.

Như chúng ta đã học trong phần 4, chúng ta có thể làm cho các hàm declarative hơn bằng `equals` và `gte`. Hãy bắt đầu từ đó.

```js
const wasBornInCountry = (person) => equals(person.birthCountry, OUR_COUNTRY)
const wasNaturalized = (person) => Boolean(person.naturalizationDate)
const isOver18 = (person) => gte(person.age, 18)
```

Để làm cho các hàm này pointfree, chúng ta cần một cách để xây dựng hàm mà sau đó chúng ta có thể áp dụng cho `person`. Vấn đề là chúng ta cần truy cập vào các thuộc tính của `person` và cách duy nhất chúng ta biết là làm điều đó theo cách imperative.

### prop
May mắn thay, Ramda có thể giúp chúng ta. Nó cung cấp hàm `prop` để truy cập các thuộc tính của một đối tượng.

Sử dụng `prop`, chúng ta có thể biến `person.birthCountry` thành `prop('birthCountry', person)`. Hãy bắt đầu với điều đó.

```js
const wasBornInCountry = (person) =>
  equals(prop('birthCountry', person), OUR_COUNTRY)
const wasNaturalized = (person) => Boolean(prop('naturalizationDate', person))
const isOver18 = (person) => gte(prop('age', person), 18)
```

Wow, trông bây giờ tệ hơn nhiều. Nhưng chúng ta hãy tiếp tục với refactoring. Thứ nhất, chúng ta hãy hoán đổi thứ tự của các đối số mà chúng ta truyền cho `equals` để `prop` đến cuối cùng. `equals` hoạt động như nhau đối với cả hai thứ tự, vì vậy điều này là an toàn.

```js
const wasBornInCountry = (person) =>
  equals(OUR_COUNTRY, prop('birthCountry', person))
const wasNaturalized = (person) => Boolean(prop('naturalizationDate', person))
const isOver18 = (person) => gte(prop('age', person), 18)
```

Tiếp theo, chúng ta hãy sử dụng tính chất curried của `equals` và `gte` để tạo các hàm mới mà chúng ta sẽ áp dụng cho kết quả của các lệnh gọi `prop`.

```js
const wasBornInCountry = (person) =>
  equals(OUR_COUNTRY)(prop('birthCountry', person))
const wasNaturalized = (person) => Boolean(prop('naturalizationDate', person))
const isOver18 = (person) => gte(__, 18)(prop('age', person))
```

Nó thậm chí còn tệ hơn trước, nhưng hãy tiếp tục nào. Hãy tận dụng lợi thế của currying một lần nữa với tất cả các lệnh gọi `prop`.

```js
const wasBornInCountry = (person) =>
  equals(OUR_COUNTRY)(prop('birthCountry')(person))
const wasNaturalized = (person) => Boolean(prop('naturalizationDate')(person))
const isOver18 = (person) => gte(__, 18)(prop('age')(person))
```

Tệ hơn nữa. Nhưng bây giờ chúng ta thấy một mẫu quen thuộc. Cả ba hàm của chúng ta có cùng hình dạng với `f(g(person))`, và chúng ta biết từ phần 2 rằng điều này tương đương với `compose(f, g)(person)`.

Hãy tận dụng điều đó.

```js
const wasBornInCountry = (person) =>
  compose(equals(OUR_COUNTRY), prop('birthCountry'))(person)
const wasNaturalized = (person) =>
  compose(Boolean, prop('naturalizationDate'))(person)
const isOver18 = (person) => compose(gte(__, 18), prop('age'))(person)
```

Bây giờ tất cả ba hàm trông giống như `person => f(person)`. Chúng ta biết từ phần 5 rằng chúng ta có thể làm cho các hàm này pointfree.

```js
const wasBornInCountry = compose(equals(OUR_COUNTRY), prop('birthCountry'))
const wasNaturalized = compose(Boolean, prop('naturalizationDate'))
const isOver18 = compose(gte(__, 18), prop('age'))
```

Khi bắt đầu, thật khó để nhận ra rằng các hàm của chúng ta đã làm hai việc khác nhau. Cả hai đều truy cập thuộc tính của một đối tượng và thực hiện một số tác vụ dựa trên giá trị của thuộc tính đó. Việc tái cấu trúc này theo phong cách pointfree đã làm cho điều đó rất rõ ràng.

Hãy nhìn vào một số công cụ khác mà Ramda cung cấp để làm việc với các đối tượng.

### pick
Trong khi `prop` đọc một thuộc tính từ một đối tượng và trả về giá trị, `pick` đọc nhiều thuộc tính từ một đối tượng và trả về một đối tượng mới chỉ với các thuộc tính đó.

Ví dụ: nếu muốn lấy tên và tuổi của một người, chúng ta có thể sử dụng `pick(['name', 'age'), person)`.

### has
Nếu chúng ta chỉ muốn biết nếu một đối tượng có một thuộc tính hay không mà không cần đọc giá trị của nó thì chúng ta có thể sử dụng `has` để kiểm tra thuộc tính của chính nó, và `hasIn` để kiểm tra chuỗi prototype: `has('name', person)`.
### path
Trong khi `prop` đọc một thuộc tính từ một đối tượng, `path` đi vào các đối tượng lồng nhau. Ví dụ: chúng ta có thể truy cập mã zip từ cấu trúc sâu hơn dưới dạng `path(['address', 'zipCode'), person)`.

Lưu ý rằng `path` "khoan dung" hơn `prop`. `path` sẽ trả lại `undefined` nếu bất cứ điều gì dọc theo đường dẫn (bao gồm cả các đối số ban đầu) là `null` hoặc `undefined` trong khi `prop` sẽ gây ra một lỗi.

### propOr / pathOr
`propOr` và `pathOr` tương tự như `prop` và `path` kết hợp với `defaultTo`. Chúng cho phép bạn cung cấp giá trị mặc định để sử dụng nếu không thể tìm thấy thuộc tính hoặc đường dẫn trong đối tượng đích.

Ví dụ: chúng ta có thể cung cấp một placeholder khi chúng ta không biết tên của một người: `propOr('<Unnamed>', 'name', person)`. Lưu ý rằng không giống như `prop`, `propOr` sẽ không gây ra một lỗi nếu `person` là `null` hoặc `undefined`; nó sẽ trả về giá trị mặc định.

### keys / values
`keys` trả về một mảng có chứa tên của tất cả các thuộc tính của chính nó trong một đối tượng. `values` trả về các giá trị của các thuộc tính đó. Các hàm này có thể hữu ích khi kết hợp với các hàm lặp trên tập hợp mà chúng ta đã học được trong phần 1.

## Thêm, cập nhật và xóa thuộc tính
Bây giờ chúng ta có rất nhiều công cụ để đọc từ các đối tượng một cách declarative, nhưng khi chúng ta muốn thay đổi thì sao?

Vì tính bất biến là quan trọng, chúng ta không muốn thay đổi trực tiếp các đối tượng. Thay vào đó, chúng ta muốn trả lại các đối tượng mới đã được thay đổi theo cách chúng ta muốn.

Một lần nữa, Ramda cung cấp rất nhiều sự giúp đỡ cho chúng ta.

### assoc / assocPath
Khi lập trình theo cách imperative, chúng ta có thể thiết lập hoặc thay đổi tên của một người với toán tử gán: `person.name = 'New name'`.

Trong thế giới functional và bất biến, chúng ta sử dụng `assoc`: `const updatedPerson = assoc('name', 'New name', person)`.

`assoc` trả về một đối tượng mới với giá trị thuộc tính được cập nhật, để đối tượng ban đầu không thay đổi.

Ngoài ra còn có `assocPath` để cập nhật một thuộc tính lồng nhau: `const updatedPerson = assocPath(['address', 'zipcode'], '97504', person)`.

### dissoc / dissocPath / omit
Việc xoá thuộc tính thì sao? Theo cách imperative, chúng ta có thể muốn xóa `person.age`. Trong Ramda, chúng ta sẽ sử dụng `dissoc`: `const updatedPerson = dissoc('age', person)`.

`dissocPath` tương tự, nhưng hoạt động sâu hơn vào cấu trúc của đối tượng: `dissocPath(['address', 'zipCode']), person)`.

Cũng có `omit`, có thể loại bỏ một số thuộc tính cùng một lúc. `const updatedPerson = omit(['age', 'birthCountry'], person)`.

Lưu ý rằng `pick` và `omit` là khá tương tự và bổ sung cho nhau. Chúng rất tiện dụng cho white-listing (chỉ giữ lại các thuộc tính này bằng `pick`) hoặc black-listing (loại bỏ các thuộc tính này bằng `omit`).

## Chuyển đổi các thuộc tính
Bây giờ chúng ta đã biết đủ để làm việc với các đối tượng theo một cách declarative và bất biến. Hãy viết một hàm, `celebrateBirthday`, cập nhật tuổi của một người vào sinh nhật của họ.

```js
const nextAge = compose(inc, prop('age'))
const celebrateBirthday = (person) => assoc('age', nextAge(person), person)
```

Đây là một mẫu (pattern) khá phổ biến. Thay vì cập nhật thuộc tính đến một giá trị mới được biết, chúng ta thực sự muốn chuyển đổi giá trị bằng cách áp dụng một hàm cho giá trị cũ như chúng ta đã làm ở đây.

Có cách nào để viết lại `celebrateBirthday` với sự trùng lặp ít hơn và theo phong cách pointfree dựa trên các công cụ chúng ta biết?

Ramda giải cứu chúng ta một lần nữa với hàm `evolve` của nó.

`evolve` có một đối tượng xác định một hàm chuyển đổi cho mỗi thuộc tính được chuyển đổi. Hãy tái tổ chức lại `celebrateBirthday` để sử dụng `evolve`:

```js
const celebrateBirthday = evolve({ age: inc })
```

`Copycopy code to clipboard1const celebrateBirthday = evolve({ age: inc })`

Code này để phát triển đối tượng đích (không được hiển thị ở đây vì phong cách pointfree) bằng cách tạo ra một đối tượng mới có cùng các thuộc tính và giá trị, nhưng `age` của nó có được bằng cách áp dụng `inc` với giá trị `age` gốc.

`evolve` có thể chuyển đổi nhiều thuộc tính cùng một lúc và ở nhiều cấp độ nesting. Đối tượng chuyển đổi có thể có cùng hình dạng với đối tượng đang được tiến hóa và `evolve` sẽ đệ quy qua các cấu trúc, áp dụng các hàm chuyển đổi khi nó đi.

Lưu ý rằng `evolve` sẽ không thêm thuộc tính mới; nếu bạn chỉ định một sự chuyển đổi cho một thuộc tính không xuất hiện trong đối tượng đích, thì `evolve` sẽ bỏ qua nó.

## Hợp nhất các đối tượng
Đôi khi, bạn sẽ muốn hợp nhất hai đối tượng lại với nhau. Một trường hợp phổ biến là khi bạn có một hàm có các tùy chọn (options) và bạn muốn kết hợp các tùy chọn này với một bộ các tùy chọn mặc định. Ramda cung cấp `merge` cho mục đích này.

```jsx
function f(a, b, options = {}) {
  const defaultOptions = { value: 42, local: true }
  const finalOptions = merge(defaultOptions, options)
}
```

`merge` trả về một đối tượng mới có chứa tất cả các thuộc tính và giá trị từ cả hai đối tượng. Nếu cả hai đối tượng có cùng một thuộc tính, giá trị từ tham số thứ hai sẽ được sử dụng.

Tham số thứ hai chiến thắng có ý nghĩa khi sử dụng `merge` bởi chính nó, nhưng ít có giá trị trong một tình huống đường ống (pipe). Trong trường hợp đó, bạn thường thực hiện một loạt các biến đổi đối với một đối tượng và một trong những biến đổi đó là hợp nhất một số giá trị của thuộc tính mới. Trong trường hợp này, bạn muốn tham số đầu tiên giành chiến thắng.

Đơn giản chỉ sử dụng `merge(newValues)` trong đường ống sẽ không làm những gì bạn mong đợi.

Đối với tình huống này, chúng ta có thể định nghĩa một hàm tiện ích gọi là `reverseMerge`. Nó có thể được viết như `const reversMerge = flip(merge)`. Nhớ lại rằng `flip` đảo ngược hai đối số đầu tiên của hàm mà nó được áp dụng.

`merge` thực hiện một sự hợp nhất cạn (shallow merge). Nếu các đối tượng đang được hợp nhất cả hai đều có một thuộc tính có giá trị là một đối tượng phụ, những đối tượng con đó sẽ không được hợp nhất. Ramda hiện không có khả năng "hợp nhất sâu", nơi các đối tượng con được hợp nhất đệ quy.

Lưu ý rằng `merge` chỉ nhận hai đối số. Nếu bạn muốn hợp nhất nhiều đối tượng vào một, `mergeAll` có một mảng các đối tượng sẽ được hợp nhất.

## Kết luận
Bài viết này đã cho chúng ta một bộ công cụ để làm việc với các đối tượng theo cách declarative và bất biến. Bây giờ chúng ta có thể đọc, thêm, cập nhật, xoá và chuyển đổi thuộc tính trong các đối tượng mà không thay đổi đối tượng gốc. Và chúng ta có thể làm những điều này dựa trên sự kết hợp các hàm.

Bây giờ chúng ta có thể làm việc với các đối tượng một cách bất biến, còn mảng thì sao?

# Tính bất biến và mảng
Trong phần 6, chúng ta đã nói về làm việc với các đối tượng trong JavaScript theo cách functional và bất biến.

Trong bài viết này, chúng ta sẽ làm tương tự cho các mảng.

## Đọc phần tử mảng
Trong phần 6, chúng ta đã học về các hàm Ramda khác nhau để đọc thuộc tính đối tượng, bao gồm `prop`, `pick`, và `has`. Ramda có nhiều phương pháp để đọc các phần tử mảng.

Tương đương của `prop` là `nth`; tương đương với `pick` là `slice`, và tương đương với `has` là `contains`. Hãy nhìn vào những hàm này.

```js
const numbers = [10, 20, 30, 40, 50, 60]
nth(3, numbers) // => 40  (0-based indexing)
nth(-2, numbers) // => 50 (negative numbers start from the right)
slice(2, 5, numbers) // => [30, 40, 50] (see below)
contains(20, numbers) // => true
```

`slice` nhận hai index và trả về mảng phụ bắt đầu từ index đầu tiên (0-based) và bao gồm tất cả các phần tử được tạo ra, nhưng không bao gồm index thứ hai.

Truy cập các phần tử đầu tiên (`nth(0)`) và cuối cùng (`nth(-1)`) là khá phổ biến, vì vậy Ramda cung cấp các phím tắt cho những trường hợp đặc biệt, `head` và `last`. Nó cũng cung cấp các hàm để truy cập vào phần tử all-but-the-first (`tail`), phần tử all-but-the-last (`init`), N phần tử đầu tiên (`take(N)`) và N phần tử N cuối cùng (`takeLast(N)`). Hãy xem những hàm này.

```js
const numbers = [10, 20, 30, 40, 50, 60]
head(numbers) // => 10
tail(numbers) // => [20, 30, 40, 50, 60]
last(numbers) // => 60
init(numbers) // => [10, 20, 30, 40, 50]
take(3, numbers) // => [10, 20, 30]
takeLast(3, numbers) // => [40, 50, 60]
```

## Thêm, cập nhật và xóa các phần tử mảng
Đối với các đối tượng, chúng ta đã học về `assoc`, `dissoc`, và `omit` để thêm, cập nhật và loại bỏ các thuộc tính.

Bởi vì các mảng là một cấu trúc dữ liệu theo trình tự, có một số phương pháp thực hiện cùng công việc như `assoc`. Phổ biến nhất là `insert` và `update`, nhưng Ramda cũng cung cấp `append` và `prepend` cho trường hợp phổ biến để thêm các phần tử ở đầu hoặc cuối của mảng. `insert`, `append`, và `prepend` thêm các phần tử mới vào mảng; `update` "thay thế" một phần tử bằng một giá trị mới.

Như bạn có thể mong đợi từ một thư viện lập trình hàm, tất cả các hàm này trả lại một mảng mới với những thay đổi mong muốn; mảng ban đầu là không bao giờ thay đổi.

```js
const numbers = [10, 20, 30, 40, 50, 60]
insert(3, 35, numbers) // => [10, 20, 30, 35, 40, 50, 60]
append(70, numbers) // => [10, 20, 30, 40, 50, 60, 70]
prepend(0, numbers) // => [0, 10, 20, 30, 40, 50, 60]
update(1, 15, numbers) // => [10, 15, 30, 40, 50, 60]
```

Để kết hợp hai đối tượng thành một, chúng ta đã học về `merge`. Ramda cung cấp `concat` để làm tương tự với mảng.

```js
const numbers = [10, 20, 30, 40, 50, 60]
concat(numbers, [70, 80, 90]) // => [10, 20, 30, 40, 50, 60, 70, 80, 90]
```

Lưu ý rằng mảng thứ hai được nối vào mảng đầu tiên. Điều này có vẻ đúng khi được sử dụng bởi chính nó, nhưng như với `merge`, nó không thể làm những gì bạn mong đợi khi sử dụng trong một đường ống. Nó hữu ích để xây dựng một hàm trợ giúp `concatAfter`: `const concatAfter = flip(concat)` để sử dụng trong đường ống.

Ramda cũng cung cấp một số tùy chọn để loại bỏ các phần tử. `remove` loại bỏ các phần tử theo index, trong khi `without` loại bỏ chúng theo giá trị. Ngoài ra còn có `drop` và `dropLast` cho trường hợp thông dụng cần loại bỏ các phần tử đầu hoặc cuối của mảng.

```js
const numbers = [10, 20, 30, 40, 50, 60]
remove(2, 3, numbers) // => [10, 20, 60]
without([30, 40, 50], numbers) // => [10, 20, 60]
drop(3, numbers) // => [40, 50, 60]
dropLast(3, numbers) // => [10, 20, 30]
```

Lưu ý rằng `remove` nhận một index và một số đếm trong khi đó `slice` nhận hai index. Sự không thống nhất này có thể gây nhầm lẫn nếu bạn không để ý đến nó.

## Chuyển đổi các phần tử
Giống như đối tượng, chúng ta có thể muốn cập nhật một phần tử mảng bằng cách áp dụng một hàm cho giá trị ban đầu.

```js
const numbers = [10, 20, 30, 40, 50, 60]
update(2, multiply(10, nth(2, numbers)), numbers) // => [10, 20, 300, 40, 50, 60]
```

Để đơn giản hóa trường hợp sử dụng phổ biến này, Ramda cung cấp `adjust` hoạt động tương tự như `evolve` đối với các đối tượng. Không giống như `evolve`, `adjust` chỉ hoạt động cho một phần tử mảng đơn.

```js
const numbers = [10, 20, 30, 40, 50, 60]
adjust(multiply(10), 2, numbers)
```

Lưu ý rằng hai đối số đầu tiên của `adjust` được đổi chỗ khi so sánh với `update`. Đây có thể là một nguồn gây nhầm lẫn, nhưng nó có ý nghĩa khi bạn cân nhắc việc áp dụng từng phần. Bạn có thể muốn cung cấp một hàm điều chỉnh với `adjust(multiply(10))` và sau đó quyết định index và mảng nào áp dụng hàm điều chỉnh đó.

## Kết luận
Bây giờ chúng ta có các công cụ để làm việc với các mảng và các đối tượng theo một cách declarative và bất biến. Điều này cho phép chúng ta xây dựng các chương trình trên các khối xây dựng nhỏ, có hàm, kết hợp các hàm để làm những gì chúng ta cần mà không làm thay đổi cấu trúc dữ liệu.

Chúng ta đã học cách đọc, cập nhật và chuyển đổi các thuộc tính đối tượng và các phần tử mảng. Ramda cung cấp một công cụ tổng quát hơn để thực hiện các hoạt động này, ống kính (lens).

# Lenses
Trong phần 6 và phần 7, chúng ta đã học cách đọc, cập nhật và chuyển đổi các thuộc tính của đối tượng và các phần tử mảng theo cách declarative và bất biến.

Ramda cung cấp một công cụ tổng quát hơn để thực hiện các tác vụ này, lens (ống kính).

### Lens là gì?
Lens kết hợp một hàm "getter" và một hàm "setter" vào một đơn vị duy nhất. Ramda cung cấp một bộ các hàm để làm việc với lens.

Chúng ta có thể nghĩ đến lens như một cái gì đó tập trung vào một phần cụ thể của một cấu trúc dữ liệu lớn hơn.

### Làm thế nào để tạo một lens?
Cách phổ biến nhất để tạo một lens ở Ramda là dùng hàm `lens`. `lens` nhận vào một hàm getter, một hàm setter và trả về lens mới.

```js
const person = {
  name: 'Randy',
  socialMedia: {
    github: 'randycoulman',
    twitter: '@randycoulman',
  },
}
const nameLens = lens(prop('name'), assoc('name'))
const twitterLens = lens(
  path(['socialMedia', 'twitter']),
  assocPath(['socialMedia', 'twitter'])
)
```

Ở đây chúng ta sử dụng `prop` và `path` như các hàm getter, `assoc` và `assocPath` như các hàm setter.

Lưu ý rằng chúng ta phải sao chép các thuộc tính và đối số đường dẫn đến các hàm này. May mắn thay, Ramda cung cấp các phím tắt cho các trường hợp sử dụng phổ biến nhất của lens: `lensProp`, `lensPath`, và `lensIndex`.

-  lensProp` tạo ra một lens tập trung vào một thuộc tính của một đối tượng.
-  lensPath` tạo ra một lens tập trung vào một thuộc tính lồng nhau của một đối tượng.
-  lensIndex` tạo ra một lens tập trung vào một phần tử của mảng.

Chúng ta có thể viết lại lens ở trên với `lensProp` và `lensPath`:

```js
const nameLens = lensProp('name')
const twitterLens = lensPath(['socialMedia', 'twitter'])
```

Nó đơn giản hơn rất nhiều và không bị trùng lắp.

### **Tôi có thể làm gì với nó?**

OK, tuyệt vời, chúng ta đã tạo ra một số lens. Chúng ta có thể làm gì với chúng?

Ramda cung cấp ba hàm để làm việc với lens.

- `view` đọc giá trị của lens.
- `set` cập nhật giá trị của lens.
- `over` áp dụng một hàm chuyển đổi cho lens.

```js
view(nameLens, person) // => 'Randy'

set(twitterLens, '@randy', person)
// => {
//   name: 'Randy',
//   socialMedia: {
//     github: 'randycoulman',
//     twitter: '@randy'
//   }
// }

over(nameLens, toUpper, person)
// => {
//   name: 'RANDY',
//   socialMedia: {
//     github: 'randycoulman',
//     twitter: '@randycoulman'
//   }
// }
```

Lưu ý rằng `set` và `over` trả lại toàn bộ đối tượng với thuộc tính của lens được sửa đổi theo chỉ định.

### Kết luận
Các lens có thể hữu ích nếu chúng ta có một cấu trúc dữ liệu phức tạp mà chúng ta muốn trừu tượng hoá. Thay vì phơi bày cấu trúc hoặc cung cấp một bộ getter, setter, và hàm chuyển đổi cho mọi thuộc tính, chúng ta có thể cung cấp các lens.

Code sau đó có thể làm việc với cấu trúc dữ liệu của chúng ta bằng cách sử dụng `view`, `set` và `over` mà không cần phải kết hợp với hình dạng chính xác của cấu trúc.

Bây giờ chúng ta đã học được rất nhiều thứ mà Ramda cung cấp; chắc chắn đủ để làm hầu hết những gì chúng ta cần làm trong các chương trình của chúng ta. Phần tiếp theo đánh giá series này và đề cập đến một số chủ đề khác mà chúng ta có thể muốn khám phá thêm.

# Tổng kết
Chúng ta đã nói về thư viện [Ramda](http://ramdajs.com/) cung cấp các hàm để làm việc với JavaScript theo hướng lập trình hàm, declarative và bất biến.

Chúng ta biết rằng Ramda có một số nguyên tắc cơ bản:

- Dữ liệu cuối cùng: Hầu như tất cả các hàm nhận tham số dữ liệu như là tham số cuối cùng.
- Currying: Hầu như mọi hàm trong Ramda đều được "curried". Nghĩa là, bạn có thể gọi một hàm chỉ với một tập con các tham số yêu cầu, và nó sẽ trả về một hàm mới nhận vào các tham số còn lại. Một khi tất cả các tham số được cung cấp, hàm ban đầu sẽ được thực thi.

Hai nguyên tắc này cho phép chúng ta viết code theo hướng lập trình hàm rất rõ ràng, kết hợp các khối xây dựng cơ bản thành các tác vụ hữu ích hơn.

Chúng ta đã không bao gồm tất cả các phần của Ramda trong series này. Đặc biệt, chúng ta đã không nói về các hàm để làm việc với chuỗi và những khái niệm tiên tiến hơn như [transducers](http://ramdajs.com/0.21.0/docs/#transduce).

Để tìm hiểu thêm về những gì Ramda có thể làm, bạn nên đọc kỹ [tài liệu](http://ramdajs.com/docs/). Có rất nhiều thông tin ở đó. Tất cả các hàm được nhóm lại theo loại dữ liệu mà chúng hoạt động, mặc dù có sự đan xen nhau. Ví dụ, một số các hàm mảng cũng sẽ làm việc trên chuỗi, và `map` hoạt động trên cả mảng và đối tượng.

Nếu bạn quan tâm đến các chủ đề lập trình hàm nâng cao hơn, đây là một số nơi bạn có thể tìm hiểu:

- Transducers: Có một [bài giới thiệu hay](http://simplectic.com/blog/2015/ramda-transducers-logs/) về phân tích logs với các transducers.
- Các kiểu dữ liệu đại số (ADTs): Nếu bạn đã đọc nhiều về lập trình hàm, bạn có thể sẽ nghe về các kiểu đại số và thuật ngữ như "Functor", "Applicative" và "Monad". Nếu bạn quan tâm đến việc khám phá những ý tưởng này trong ngữ cảnh của Ramda, hãy xem thử dự án [ramda-fantasy](https://github.com/ramda/ramda-fantasy), nó bổ sung một số loại dữ liệu phù hợp với [Fantasy Land Specification](https://github.com/fantasyland/fantasy-land) (aka Algebraic JavaScript Specification).