function TrendingCourses_owlCarousel() {
    setTimeout(() => {
        $('.my-custom-carousel').owlCarousel({
            stagePadding: 100,
            loop: true,
            margin: 30,
            smartSpeed: 3000,
            autoplay: true,
            autoplayHoverPause: true,
            nav: true,

            responsive: {
                0: { items: 1, stagePadding: 20 },
                600: { items: 1, stagePadding: 100 },
                1000: { items: 3, stagePadding: 100 }
            }
        });
    }, 2000);
}

function TestMonials_owlCarousel() {
    setTimeout(() => {
        $('.testimonials123').owlCarousel({
            loop: false,
            margin: 10,
            nav: true,
            dots: true,
            autoplay: true,
            autoplayTimeout: 5000,
            responsive: {
                0: {
                    items: 1
                },
                768: {
                    items: 2
                },
                992: {
                    items: 3
                }
            }
        })
    }, 2000);
}

function MainSlider_owlCarousel() {
    $(document).ready(function () {
        var owl = $('.mainslider');
        owl.owlCarousel({
            loop: true,
            dots: false,
            margin: 10,
            nav: false,
            autoplay: true,
            items: 1,
        });

        // Custom Button
        $('.customNextBtn').click(function () {
            owl.trigger('next.owl.carousel');
        });
        $('.customPreviousBtn').click(function () {
            owl.trigger('prev.owl.carousel');
        });

    });

}

function AllCategories_owlCarousel() {
    setTimeout(() => {
        $('.owl-carousel3').owlCarousel({
            loop: true,
            margin: 20,
            autoplay: 1000,
            stagePadding: 20,
            autoWidth: true,
            // nav: true,
            // navText: ['<i class="fa-solid fa-chevron-left fa-2x" aria-hidden="true"></i>', '<i class="fa-solid fa-chevron-right fa-1x" aria-hidden="true"></i>',],
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 3
                },
                1000: {
                    items: 5
                }
            }
        })
    }, 2000);
}

function Partners_owlCarousel() {
    setTimeout(() => {
        $('.partener11').owlCarousel({

            loop: true,
            margin: 3,
            autoplay: true,
            responsiveClass: true,
            smartSpeed: 3000,

            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 3
                },
                1000: {
                    items: 5
                }
            }
        })
    }, 2000);
}




function sliderCoursal() {
    //$('.site-main .about-area .owl-carousel').owlCarousel({ loop: true, autoplay: true, dots: true, responsive: { 0: { items: 1 }, 560: { items: 2 } } })
    $('.owl-carousel1').owlCarousel({
        stagePadding: 100,
        loop: true,
        margin: 30,
        smartSpeed: 3000,
        autoplay: 1000,
        autoplay: true,
        nav: true,

        responsive: {
            0: {
                items: 1,
                stagePadding: 20
            },
            600: {
                items: 1,
                stagePadding: 100
            },
            1000: {
                items: 3,
                stagePadding: 100
            }


        }


    })

    $('.clientlogo').owlCarousel({

        loop: true,
        margin: 3,
        autoplay: true,
        responsiveClass: true,
        smartSpeed: 3000,

        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 3
            },
            1000: {
                items: 5
            }
        }
    })

    $('.testimonials').owlCarousel({
        loop: true,
        margin: 3,
        dots: true,
        responsiveClass: true,
        smartSpeed: 3000,
        singleItem: true,

        dots: true,
        items: 1,
        autoplay: true,
        singleItem: true,


    })





    // $('.them1').owlCarousel({
    //     loop: true,
    //     dots: false,
    //     margin: 10,
    //     nav: false,
    //     autoplay: true,
    //     items: 1,
    //     responsive: {
    //         0: {
    //             items: 1
    //         },
    //         600: {
    //             items: 1
    //         },
    //         1000: {
    //             items: 1
    //         }
    //     }
    // });

    $(document).ready(function () {
        var owl = $('.them1');
        owl.owlCarousel({
            loop: true,
            dots: true,
            margin: 10,
            nav: true,
            autoplay: true,
            items: 1,
        });

        // Custom Button
        $('.customNextBtn').click(function () {
            owl.trigger('next.owl.carousel');
        });
        $('.customPreviousBtn').click(function () {
            owl.trigger('prev.owl.carousel');
        });

    });





}

