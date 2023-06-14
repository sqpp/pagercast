
function update()
   local ct = gdt.CPU0.Time
   vid:Clear(var.col.dim)
   -- Show welcome text for 4 seconds
   if showWelcome and ct < 4 then
      -- Show and animate welcome text
      animationTime = animationTime + gdt.CPU0.DeltaTime
      yOffset = math.floor(math.sin(animationTime * ySpeed) * 8)
      -- Draw welcome text
      vid:DrawText(vec2(textCenter(welcomeText), 12 + yOffset), spriteFont, welcomeText, color.black, color.clear)

      -- Blink the screen every 500 milliseconds
      if ct - lastToggleTime >= 0.5 then
         if isBlinkOn then
            vid:Clear(color.green)
         else
            vid:Clear(var.col.dim)
         end
         isBlinkOn = not isBlinkOn
         lastToggleTime = ct
      end
   else
      showWelcome = false
      vid:Clear(var.col.dim)
      if button.func.ButtonDown then
				
         if not setup.register and not showWelcome then
            setup.register = true
            vid:Clear(var.col.dim)
            vid:DrawText(vec2(textCenter(tostring(setupText)), 6), spriteFont, tostring(setupText), color.black, color.clear)
            vid:DrawText(vec2(textCenter(tostring(setupText2)), 14), spriteFont, tostring(setupText2), color.black, color.clear)
            vid:DrawText(vec2(textCenter(tostring(setupText3)), 22), spriteFont, tostring(setupText3), color.black, color.clear)
         end
      elseif button.func.ButtonUp then
         if buttonPressedTime and gdt.CPU0.Time >= buttonPressedTime + 1 then
            if not showWelcome then
               backlitEnabled = true
            end
         end
         buttonPressedTime = nil
      end


      if backlitEnabled then
         vid:Clear(color.green)
      else
         vid:Clear(var.col.dim)
      end

      desk.ShowMessage(setupText, true)

      -- Toggle setup text visibility every 1 second
      if ct - lastToggleTime >= 1 then
         textVisible = not textVisible
         lastToggleTime = ct
      end
      -- Show setup text if visible
      if textVisible and setup.register then
         vid:DrawText(vec2(textCenter(setupText), 6), spriteFont, setupText, color.black, color.clear)
         vid:DrawText(vec2(textCenter(setupText2), 14), spriteFont, setupText2, color.black, color.clear)
         vid:DrawText(vec2(textCenter(setupText3), 22), spriteFont, setupText3, color.black, color.clear)
      end


   end
end