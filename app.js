$(document).ready(() => {
  const baseURL = 'https://deckofcardsapi.com/api/deck';

  // 1.
  function part1() {
    return new Promise((resolve, reject) => {
      $.getJSON(`${baseURL}/new/draw/`)
        .done(data => {
          const { cards } = data;
          const { suit, value } = cards[0];
          console.log(`${value.toLowerCase()} of ${suit.toLowerCase()}`);
          resolve();
        })
        .fail(error => {
          console.error('Error in part1:', error);
          reject(error);
        });
    });
  }

  // 2.
  function part2() {
    return new Promise((resolve, reject) => {
      $.getJSON(`${baseURL}/new/draw/`)
        .done(firstCardData => {
          const deckId = firstCardData.deck_id;
          $.getJSON(`${baseURL}/${deckId}/draw/`)
            .done(secondCardData => {
              [firstCardData, secondCardData].forEach(({ cards }) => {
                const { suit, value } = cards[0];
                console.log(`${value.toLowerCase()} of ${suit.toLowerCase()}`);
              });
              resolve();
            })
            .fail(error => {
              console.error('Error in part2:', error);
              reject(error);
            });
        })
        .fail(error => {
          console.error('Error in part2:', error);
          reject(error);
        });
    });
  }

  // 3.
  function setup() {
    const $btn = $('button');
    const $cardArea = $('#card-area');

    $.getJSON(`${baseURL}/new/shuffle/`)
      .done(deckData => {
        $btn.show().on('click', () => {
          $.getJSON(`${baseURL}/${deckData.deck_id}/draw/`)
            .done(cardData => {
              const cardSrc = cardData.cards[0].image;
              const angle = Math.random() * 90 - 45;
              const randomX = Math.random() * 40 - 20;
              const randomY = Math.random() * 40 - 20;

              $cardArea.append(
                $('<img>', {
                  src: cardSrc,
                  css: {
                    transform: `translate(${randomX}px, ${randomY}px) rotate(${angle}deg)`
                  }
                })
              );

              if (cardData.remaining === 0) $btn.remove();
            })
            .fail(error => {
              console.error('Error fetching card data:', error);
            });
        });
      })
      .fail(error => {
        console.error('Error setting up:', error);
      });
  }

  setup();
});
