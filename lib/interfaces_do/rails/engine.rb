module InterfacesDo
  module Rails
    class Engine < ::Rails::Engine
      isolate_namespace InterfacesDo::Rails
    end
  end
end
