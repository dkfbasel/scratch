package sampleHandlers_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"bitbucket.org/dkfbasel/scratch/src/backend/sampleHandlers"

	"github.com/labstack/echo"
	. "github.com/smartystreets/goconvey/convey"
)

func TestHelloWord(t *testing.T) {

	Convey("Given a running server", t, func() {

		Convey("The hello world handler should return a string", func() {

			router := echo.New()
			request := new(http.Request)
			recorder := httptest.NewRecorder()
			ctx := router.NewContext(request, recorder)

			ctx.SetPath("/")
			err := sampleHandlers.HelloWorld(ctx)

			So(err, ShouldBeNil)
			So(recorder.Body.String(), ShouldEqual, "Greetings Earthlings!")

		})

	})

}
