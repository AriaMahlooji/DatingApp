using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class LoginDTO
    {
        [Required(ErrorMessage ="Username is missing")]
        public string Username  { get; set; }

        [Required(ErrorMessage ="Password is missing")]
        public string Password { get; set; }     
    }
}