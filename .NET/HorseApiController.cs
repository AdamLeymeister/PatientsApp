/*using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Models;
using Models.Domain.HorseProfiles;
using Models.Requests.HorseProfiles;
using Services;
using Services.Interfaces.HorseProfiles;
using Web.Controllers;
using Web.Models.Responses;
using System;*/
namespace Web.Api.Controllers;

[Route("api/horses")]
[ApiController]
public class HorseApiController : BaseApiController
{
    private ILogger _logger;
    private IAuthenticationService<int> _authService;
    private IHorseService _service;
    public HorseApiController(ILogger<HorseApiController> logger, IAuthenticationService<int> authService, IHorseService service) : base(logger)
    {
        _logger = logger;
        _authService = authService;
        _service = service;
    }
    [HttpGet]
    public ActionResult<ItemResponse<HorseProfile>> GetAll(int pageIndex, int pageSize)
    {
        int code = 200;
        BaseResponse response = null;
        try
        {
            Paged<HorseProfile> results = _service.GetAll(pageIndex, pageSize);
            if (results == null)
            {
                code = 404;
                response = new ErrorResponse("App Resource not found.");
            }
            else
            {
                response = new ItemResponse<Paged<HorseProfile>> { Item = results };
            }
        }
        catch (Exception ex)
        {
            code = 500;
            response = new ErrorResponse(ex.Message);
            _logger.LogError(ex.ToString());
        }
        return StatusCode(code, response);
    }
    [HttpGet("search")]
    public ActionResult<ItemResponse<HorseProfile>> Search(string query, int pageIndex, int pageSize)
    {
        int code = 200;
        BaseResponse response = null;
        try
        {
          
            Paged<HorseProfile> results = _service.Search(query, pageIndex, pageSize);
            if (results == null)
            {
                code = 404;
                response = new ErrorResponse("App Resource not found.");
            }
            else
            {
                response = new ItemResponse<Paged<HorseProfile>> { Item = results };
            }
        }
        catch (Exception ex)
        {
            code = 500;
            response = new ErrorResponse(ex.Message);
            _logger.LogError(ex.ToString());
        }
        return StatusCode(code, response);
    }
    [HttpGet("current")]
    public ActionResult<ItemResponse<HorseProfile>> SearchByCreatedBy(int pageIndex, int pageSize)
    {
        int code = 200;
        BaseResponse response = null;
        try
        {
            int iCurrentUserId = _authService.GetCurrentUserId();
            Paged<HorseProfile> results = _service.SearchByCreatedBy(iCurrentUserId, pageIndex, pageSize);
            if (results == null)
            {
                code = 404;
                response = new ErrorResponse("App Resource not found.");
            }
            else
            {
                response = new ItemResponse<Paged<HorseProfile>> { Item = results };
            }
        }
        catch (Exception ex)
        {
            code = 500;
            response = new ErrorResponse(ex.Message);
            _logger.LogError(ex.ToString());
        }
        return StatusCode(code, response);
    }
    [HttpGet("{id:int}")]
    public ActionResult<ItemResponse<HorseProfile>> GetById(int id)
    {
        int code = 200;
        BaseResponse response = null;
        try
        {
            HorseProfile result = _service.GetById(id);
            if (result == null)
            {
                code = 404;
                response = new ErrorResponse("App Resource not found.");
            }
            else
            {
                response = new ItemResponse<HorseProfile> { Item = result };
            }
        }
        catch (Exception ex)
        {
            code = 500;
            response = new ErrorResponse(ex.Message);
            _logger.LogError(ex.ToString());
        }
        return StatusCode(code, response);
    }
    [HttpPost]
    public ActionResult<ItemResponse<int>> Create(HorseAddRequest model)
    {
        ObjectResult result = null;
        try
        {
            int iCurrentUserId = _authService.GetCurrentUserId();
            int id = _service.Create(model, iCurrentUserId);
            ItemResponse<int> response = new ItemResponse<int> { Item = id };
            result = Created201(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.ToString());
            ErrorResponse response = new ErrorResponse(ex.Message);
            result = StatusCode(500, response);
        }
        return result;
    }
    [HttpPut("{id:int}")]
    public ActionResult<SuccessResponse> Update(HorseUpdateRequest model)
    {
        int code = 200;
        BaseResponse response = null;
        try
        {
            int iCurrentUserId = _authService.GetCurrentUserId();
            _service.Update(model, iCurrentUserId);
            response = new SuccessResponse();
        }
        catch (Exception ex)
        {
            code = 500;
            response = new ErrorResponse(ex.Message);
            _logger.LogError(ex.ToString());
        }
        return StatusCode(code, response);
    }
    [HttpDelete("{id:int}")]
    public ActionResult<SuccessResponse> Delete(int id)
    {
        int code = 200;
        BaseResponse response = null;
        try
        {
            _service.Delete(id);
            response = new SuccessResponse();
        }
        catch (Exception ex)
        {
            code = 500;
            response = new ErrorResponse(ex.Message);
            _logger.LogError(ex.ToString());
        }
        return StatusCode(code, response);
    }
    [HttpDelete("vet/{id:int}")]
    
    public ActionResult<SuccessResponse> VetRemove(int id)
    {
        int code = 200;
        BaseResponse response = null;
        try
        {
            _service.VetRemove(id);
            response = new SuccessResponse();
        }
        catch (Exception ex)
        {
            code = 500;
            response = new ErrorResponse(ex.Message);
            _logger.LogError(ex.ToString());
        }
        return StatusCode(code, response);
    }
    
    [HttpGet("vet")]
    public ActionResult<ItemResponse<HorseProfile>>SearchVetPatients(int pageIndex, int pageSize)
    {
        int code = 200;
        BaseResponse response = null;
        try
        {
            int iCurrentUserId = _authService.GetCurrentUserId();
            Paged<HorseProfile> results = _service.SearchVetPatients(iCurrentUserId, pageIndex, pageSize);
            if (results == null)
            {
                code = 404;
                response = new ErrorResponse("App Resource not found.");
            }
            else
            {
                response = new ItemResponse<Paged<HorseProfile>> { Item = results };
            }
        }
        catch (Exception ex)
        {
            code = 500;
            response = new ErrorResponse(ex.Message);
            _logger.LogError(ex.ToString());
        }
        return StatusCode(code, response);
    }
}
    